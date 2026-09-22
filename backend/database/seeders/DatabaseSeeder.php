<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Plant;
use App\Models\WasteCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $plant3 = Plant::updateOrCreate(
            ['code' => 'PLANT-3'],
            ['name' => 'Plant 3', 'is_active' => true],
        );
        Plant::updateOrCreate(
            ['code' => 'PLANT-5'],
            ['name' => 'Plant 5', 'is_active' => true],
        );

        $production = Department::updateOrCreate(
            ['code' => 'PROD'],
            ['name' => 'GA', 'is_active' => true],
        );
        Department::where('name', 'Produksi')->update(['name' => 'GA']);
        Department::updateOrCreate(
            ['code' => 'WH'],
            ['name' => 'Gudang', 'is_active' => true],
        );

        foreach (['Kertas', 'Plastik', 'Logam', 'Lainnya', 'Sampah Organik', 'Sampah Anorganik', 'Sampah Residu'] as $category) {
            WasteCategory::updateOrCreate(
                ['name' => $category],
                ['is_active' => true],
            );
        }

        User::updateOrCreate(
            ['email' => 'admin@skda.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'plant_id' => $plant3->id,
                'department_id' => $production->id,
            ],
        );
        User::updateOrCreate(
            ['email' => 'operator@skda.test'],
            [
                'name' => 'Operator SKDA',
                'password' => Hash::make('password'),
                'role' => 'operator',
                'plant_id' => $plant3->id,
                'department_id' => $production->id,
            ],
        );
    }
}
