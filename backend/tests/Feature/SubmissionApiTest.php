<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Plant;
use App\Models\WasteCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_user_can_login_and_create_a_submission_form(): void
    {
        $this->seed();

        $login = $this->postJson('/api/login', [
            'email' => 'operator@skda.test',
            'password' => 'password',
        ]);

        $login->assertSuccessful()->assertJsonStructure(['token', 'user']);

        $token = $login->json('token');
        $form = $this->withToken($token)->postJson('/api/submission-forms', [
            'submission_date' => '2026-09-13',
            'plant_id' => Plant::where('code', 'PLANT-3')->value('id'),
            'department_id' => Department::where('code', 'PROD')->value('id'),
            'items' => [[
                'waste_code' => 'W-001',
                'waste_name' => 'Karton Barcode / Label',
                'waste_category_id' => WasteCategory::where('name', 'Kertas')->value('id'),
                'weight_kg' => 21.4,
                'package_quantity' => 1,
                'package_type' => 'Sak',
                'handover_time' => '09:13',
            ]],
        ]);

        $form->assertCreated()
            ->assertJsonPath('form_number', 'PS/2026/09/001')
            ->assertJsonPath('status', 'pending');

        $formId = $form->json('id');
        $updated = $this->withToken($token)->putJson("/api/submission-forms/{$formId}", [
            'submission_date' => '2026-09-13',
            'plant_id' => Plant::where('code', 'PLANT-3')->value('id'),
            'department_id' => Department::where('code', 'PROD')->value('id'),
            'items' => [[
                'waste_code' => 'W-002',
                'waste_name' => 'Kardus Bekas',
                'waste_category_id' => WasteCategory::where('name', 'Kertas')->value('id'),
                'weight_kg' => 38,
                'package_quantity' => 2,
                'package_type' => 'Sak',
                'handover_time' => '09:13',
            ]],
        ]);

        $updated->assertSuccessful()
            ->assertJsonPath('items.0.waste_code', 'W-002')
            ->assertJsonPath('status', 'pending');
    }
}