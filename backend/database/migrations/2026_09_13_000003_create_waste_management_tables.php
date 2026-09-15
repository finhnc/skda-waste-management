<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plants', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('waste_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('operator')->index();
            $table->foreignId('plant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
        });

        Schema::create('submission_forms', function (Blueprint $table) {
            $table->id();
            $table->string('form_number', 50)->unique();
            $table->date('submission_date');
            $table->foreignId('plant_id')->constrained()->restrictOnDelete();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('supervisor_name')->nullable();
            $table->string('tps_manager_name')->nullable();
            $table->string('status')->default('pending')->index();
            $table->timestamp('approved_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('submission_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_form_id')->constrained()->cascadeOnDelete();
            $table->string('waste_code', 50);
            $table->string('waste_name');
            $table->foreignId('waste_category_id')->constrained()->restrictOnDelete();
            $table->decimal('weight_kg', 10, 2);
            $table->unsignedInteger('package_quantity')->default(1);
            $table->string('package_type', 50);
            $table->time('handover_time');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_form_id')->constrained()->cascadeOnDelete();
            $table->foreignId('approver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('approver_role', 50);
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('acted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('submission_items');
        Schema::dropIfExists('submission_forms');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['plant_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn(['role', 'plant_id', 'department_id']);
        });
        Schema::dropIfExists('waste_categories');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('plants');
    }
};