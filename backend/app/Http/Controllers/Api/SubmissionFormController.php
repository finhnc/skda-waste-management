<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubmissionItem;
use App\Models\SubmissionForm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionFormController extends Controller
{
    public function report(Request $request): JsonResponse
    {
        $hasExactDate = $request->filled('date');
        $hasDateRange = $request->filled('date_from') || $request->filled('date_to');
        $hasMonth = $request->filled('month');

        $forms = SubmissionForm::with(['items.category'])
            ->when($hasExactDate, fn ($query) => $query->whereDate('submission_date', $request->date))
            ->when(!$hasExactDate && $request->filled('date_from'), fn ($query) => $query->whereDate('submission_date', '>=', $request->date_from))
            ->when(!$hasExactDate && $request->filled('date_to'), fn ($query) => $query->whereDate('submission_date', '<=', $request->date_to))
            ->when(!$hasExactDate && !$hasDateRange && $request->filled('year'), fn ($query) => $query->whereYear('submission_date', $request->integer('year')))
            ->when(!$hasExactDate && !$hasDateRange && $hasMonth, fn ($query) => $query->whereMonth('submission_date', $request->integer('month')))
            ->get();

        $isDaily = $hasExactDate || $hasDateRange || $hasMonth;
        $groupFormat = $isDaily ? 'Y-m-d' : 'Y-m';

        $timeline = $forms->groupBy(fn ($form) => $form->submission_date->format($groupFormat))
            ->map(function ($forms, $period) {
                $items = $forms->flatMap->items;
                return [
                    'period' => $period,
                    'month' => $period,
                    'total_forms' => $forms->count(),
                    'approved' => $forms->where('status', 'approved')->count(),
                    'pending' => $forms->where('status', 'pending')->count(),
                    'total_weight' => (float) $items->sum('weight_kg'),
                ];
            })->sortKeys()->values();

        $items = $forms->flatMap->items;
        $categories = $items->groupBy(fn ($item) => $item->category?->name ?? 'Lainnya')
            ->map(fn ($items, $category) => ['category' => $category, 'total_weight' => (float) $items->sum('weight_kg'), 'item_count' => $items->count()])
            ->sortByDesc('total_weight')->values();

        return response()->json([
            'period_type' => $isDaily ? 'daily' : 'monthly',
            'summary' => [
                'total_forms' => $forms->count(),
                'approved' => $forms->where('status', 'approved')->count(),
                'pending' => $forms->where('status', 'pending')->count(),
                'total_weight' => (float) $items->sum('weight_kg'),
            ],
            'monthly' => $timeline,
            'categories' => $categories,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = SubmissionForm::with(['plant', 'department', 'creator', 'items.category'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();
                $query->where(function ($query) use ($search) {
                    $query->where('form_number', 'like', "%{$search}%")
                        ->orWhereHas('creator', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('department', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('plant', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->filled('date_from'), fn ($query) => $query->whereDate('submission_date', '>=', $request->date_from))
            ->when($request->filled('date_to'), fn ($query) => $query->whereDate('submission_date', '<=', $request->date_to))
            ->when($request->filled('status') && in_array($request->status, ['pending', 'approved'], true), fn ($query) => $query->where('status', $request->status))
            ->latest('submission_date');

        $statisticsQuery = clone $query;
        $statistics = [
            'total' => (clone $statisticsQuery)->count(),
            'approved' => (clone $statisticsQuery)->where('status', 'approved')->count(),
            'pending' => (clone $statisticsQuery)->where('status', 'pending')->count(),
            'total_weight' => (float) SubmissionItem::whereIn(
                'submission_form_id',
                (clone $statisticsQuery)->reorder()->select('id'),
            )->sum('weight_kg'),
        ];

        $forms = $query->paginate(min($request->integer('per_page', 10), 50));

        return response()->json(array_merge($forms->toArray(), ['statistics' => $statistics]));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'submission_date' => ['required', 'date'],
            'plant_id' => ['required', 'exists:plants,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'supervisor_name' => ['nullable', 'string', 'max:255'],
            'tps_manager_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.waste_code' => ['required', 'string', 'max:50'],
            'items.*.waste_name' => ['required', 'string', 'max:255'],
            'items.*.waste_category_id' => ['required', 'exists:waste_categories,id'],
            'items.*.weight_kg' => ['required', 'numeric', 'gt:0'],
            'items.*.package_quantity' => ['required', 'integer', 'min:1'],
            'items.*.package_type' => ['required', 'string', 'max:50'],
            'items.*.handover_time' => ['required', 'date_format:H:i'],
            'items.*.notes' => ['nullable', 'string'],
        ]);

        $form = DB::transaction(function () use ($data, $request) {
            $form = SubmissionForm::create([
                'form_number' => $this->nextFormNumber($data['submission_date']),
                'submission_date' => $data['submission_date'],
                'plant_id' => $data['plant_id'],
                'department_id' => $data['department_id'],
                'created_by' => $request->user()->id,
                'supervisor_name' => $data['supervisor_name'] ?? null,
                'tps_manager_name' => $data['tps_manager_name'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
            ]);

            $form->items()->createMany($data['items']);

            return $form;
        });

        return response()->json(
            $form->load(['plant', 'department', 'creator', 'items.category']),
            201,
        );
    }

    public function show(SubmissionForm $submissionForm): JsonResponse
    {
        return response()->json(
            $submissionForm->load(['plant', 'department', 'creator', 'items.category', 'approvals.approver']),
        );
    }

    public function update(Request $request, SubmissionForm $submissionForm): JsonResponse
    {
        $data = $request->validate([
            'submission_date' => ['required', 'date'],
            'plant_id' => ['required', 'exists:plants,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'supervisor_name' => ['nullable', 'string', 'max:255'],
            'tps_manager_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.waste_code' => ['required', 'string', 'max:50'],
            'items.*.waste_name' => ['required', 'string', 'max:255'],
            'items.*.waste_category_id' => ['required', 'exists:waste_categories,id'],
            'items.*.weight_kg' => ['required', 'numeric', 'gt:0'],
            'items.*.package_quantity' => ['required', 'integer', 'min:1'],
            'items.*.package_type' => ['required', 'string', 'max:50'],
            'items.*.handover_time' => ['required', 'date_format:H:i'],
            'items.*.notes' => ['nullable', 'string'],
        ]);

        $updatedForm = DB::transaction(function () use ($data, $submissionForm) {
            $submissionForm->update([
                'submission_date' => $data['submission_date'],
                'plant_id' => $data['plant_id'],
                'department_id' => $data['department_id'],
                'supervisor_name' => $data['supervisor_name'] ?? null,
                'tps_manager_name' => $data['tps_manager_name'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
                'approved_at' => null,
            ]);
            $submissionForm->items()->delete();
            $submissionForm->items()->createMany($data['items']);

            return $submissionForm;
        });

        return response()->json(
            $updatedForm->load(['plant', 'department', 'creator', 'items.category', 'approvals.approver']),
        );
    }

    public function approve(Request $request, SubmissionForm $submissionForm): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'notes' => ['nullable', 'string'],
        ]);

        $submissionForm->update([
            'status' => $data['status'],
            'approved_at' => now(),
        ]);
        $submissionForm->approvals()->create([
            'approver_id' => $request->user()->id,
            'approver_role' => $request->user()->role,
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
            'acted_at' => now(),
        ]);

        return response()->json($submissionForm->load('approvals.approver'));
    }

    private function nextFormNumber(string $date): string
    {
        $prefix = 'PS/' . date('Y/m', strtotime($date)) . '/';
        $lastNumber = SubmissionForm::where('form_number', 'like', $prefix . '%')
            ->orderByDesc('form_number')
            ->value('form_number');
        $sequence = $lastNumber ? ((int) substr($lastNumber, -3)) + 1 : 1;

        return $prefix . str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
    }
}