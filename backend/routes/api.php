<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubmissionFormController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $request) => $request->user()->load(['plant', 'department']));
    Route::get('/reports/submissions', [SubmissionFormController::class, 'report']);
    Route::apiResource('submission-forms', SubmissionFormController::class)->only(['index', 'store', 'show', 'update']);
    Route::patch('/submission-forms/{submissionForm}/approval', [SubmissionFormController::class, 'approve'])->middleware('can:admin');
    Route::patch('/submission-forms/{submissionForm}/print', [SubmissionFormController::class, 'markAsPrinted']);
    Route::patch('/submission-forms/{submissionForm}/cancel-print', [SubmissionFormController::class, 'cancelPrint']);

    // Admin-only routes
    Route::middleware('can:admin')->group(function () {
        Route::get('/users', [AuthController::class, 'index']);
        Route::post('/users', [AuthController::class, 'store']);
        Route::delete('/users/{user}', [AuthController::class, 'destroy']);
    });
});
