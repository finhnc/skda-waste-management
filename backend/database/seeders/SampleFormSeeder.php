<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Plant;
use App\Models\SubmissionForm;
use App\Models\SubmissionItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SampleFormSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create a user (operator)
        $user = User::where('email', 'operator@skda.test')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Operator SKDA',
                'email' => 'operator@skda.test',
                'password' => Hash::make('password'),
                'role' => 'operator',
                'plant_id' => 1,
                'department_id' => 1,
            ]);
        }

        $plant = Plant::where('code', 'PLANT-3')->first();
        $department = Department::where('name', 'GA')->first();

        $form = SubmissionForm::create([
            'form_number' => 'FORM-2026-001',
            'submission_date' => Carbon::now()->toDateString(),
            'plant_id' => $plant->id,
            'department_id' => $department->id,
            'created_by' => $user->id,
            'status' => 'pending',
        ]);

        // Create 15 sample items
        for ($i = 0; $i < 15; $i++) {
            SubmissionItem::create([
                'submission_form_id' => $form->id,
                'waste_code' => 'ITEM-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'waste_name' => 'Sampah Contoh ' . ($i + 1),
                'waste_category_id' => 1, // Sampah Organik
                'weight_kg' => rand(5, 30),
                'package_quantity' => rand(1, 10),
                'package_type' => 'Sak',
                'handover_time' => Carbon::now()->format('H:i:s'),
                'notes' => 'Item contoh untuk demonstrasi',
            ]);
        }

        $this->command->info('Created sample form with ID: ' . $form->id);
    }
}