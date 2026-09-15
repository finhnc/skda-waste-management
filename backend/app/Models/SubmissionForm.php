<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubmissionForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_number', 'submission_date', 'plant_id', 'department_id',
        'created_by', 'supervisor_name', 'tps_manager_name', 'status',
        'approved_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'submission_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function plant(): BelongsTo
    {
        return $this->belongsTo(Plant::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(SubmissionItem::class);
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(Approval::class);
    }
}