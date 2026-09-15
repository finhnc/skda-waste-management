<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plant extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'is_active'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function submissionForms(): HasMany
    {
        return $this->hasMany(SubmissionForm::class);
    }
}