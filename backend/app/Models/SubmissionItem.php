<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_form_id', 'waste_code', 'waste_name', 'waste_category_id',
        'weight_kg', 'package_quantity', 'package_type', 'handover_time', 'notes',
    ];

    protected function casts(): array
    {
        return ['weight_kg' => 'decimal:2'];
    }

    public function submissionForm(): BelongsTo
    {
        return $this->belongsTo(SubmissionForm::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(WasteCategory::class, 'waste_category_id');
    }
}