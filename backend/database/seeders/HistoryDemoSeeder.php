<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Plant;
use App\Models\SubmissionForm;
use App\Models\User;
use App\Models\WasteCategory;
use Illuminate\Database\Seeder;

class HistoryDemoSeeder extends Seeder
{
    public function run(): void
    {
        $operator = User::where('email', 'operator@skda.test')->firstOrFail();
        $plant = Plant::where('code', 'PLANT-3')->firstOrFail();
        $department = Department::where('code', 'PROD')->firstOrFail();
        $categories = WasteCategory::pluck('id', 'name');
        $samples = [
            ['Kertas', 'Karton Barcode / Label', 'W-001', 'Sak'],
            ['Kertas', 'Kardus Bekas', 'W-002', 'Sak'],
            ['Plastik', 'Plastik Wrapping', 'W-003', 'Karung'],
            ['Logam', 'Potongan Logam', 'W-004', 'Drum'],
            ['Lainnya', 'Material Campuran', 'W-005', 'Box'],
        ];

        for ($index = 1; $index <= 20; $index++) {
            $date = now()->subDays($index)->toDateString();
            $sample = $samples[($index - 1) % count($samples)];
            $form = SubmissionForm::updateOrCreate(
                ['form_number' => sprintf('PS/DEMO/%03d', $index)],
                [
                    'submission_date' => $date,
                    'plant_id' => $plant->id,
                    'department_id' => $department->id,
                    'created_by' => $operator->id,
                    'supervisor_name' => 'Supervisor Demo',
                    'tps_manager_name' => 'Pengurus TPS Demo',
                    'status' => $index % 4 === 0 ? 'approved' : 'pending',
                    'approved_at' => $index % 4 === 0 ? now()->subDays($index - 1) : null,
                ],
            );

            $form->items()->delete();
            $form->items()->create([
                'waste_code' => $sample[2],
                'waste_name' => $sample[1],
                'waste_category_id' => $categories[$sample[0]],
                'weight_kg' => 5 + ($index * 1.25),
                'package_quantity' => ($index % 3) + 1,
                'package_type' => $sample[3],
                'handover_time' => sprintf('%02d:%02d', 8 + ($index % 8), ($index * 7) % 60),
                'notes' => 'Data demo histori',
            ]);
        }
    }
}