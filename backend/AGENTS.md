# SKDA Waste Management Backend — Agent Guidelines

## Quick Start

**Prerequisites**: PHP 8.3+, Composer installed.

**Setup**:
```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

**Test**: `php artisan test`

---

## Project Overview

**SKDA** (Sistem Penyerahan Sampah Digital) is a waste submission tracking system for PT. Sinar Karya Duta Abadi plants.

- **Domain**: Waste category tracking, form submission, multi-level approval, reporting (XLSX export)
- **Stack**: Laravel 11 (Sanctum auth), SQLite (dev), React 18 (frontend)
- **Architecture**: RESTful API + SPA; auth via tokens; data flows through `submission_forms` → `submission_items`
- **Key files**:
  - Models: `app/Models/{SubmissionForm, SubmissionItem, User, Plant, Department, WasteCategory, Approval}`
  - Routes: `routes/api.php` (all `/api/*`)
  - Controllers: `app/Http/Controllers/Api/{AuthController, SubmissionFormController}`
  - Migrations: `database/migrations/2026_09_13_000003_create_waste_management_tables.php`

---

## Image & File Handling (Key Focus)

### Current State
- **No image fields** currently in schema or models.
- Storage configured: `storage/app/public` (local), `s3` (cloud) via `config/filesystems.php`.
- Frontend exports XLSX only (no image handling yet).

### When Adding Image/File Support

**Pattern to follow**:
1. **Add migration** with `string` column for file path (e.g., `evidence_photo_path`):
   ```php
   $table->string('evidence_photo_path')->nullable();
   ```
2. **Add fillable** to model:
   ```php
   protected $fillable = [..., 'evidence_photo_path'];
   ```
3. **File upload endpoint** (POST to `/api/submission-forms/{id}/upload-evidence`):
   - Validate: `image|mimes:jpeg,png,jpg|max:5120` (5MB)
   - Store: `Storage::disk('public')->putFile('submissions', $request->file('evidence'))`
   - Return: full URL for frontend
4. **Retrieve files**: Return `url()` attribute in API responses so frontend can render `<img src="..." />`
5. **Cleanup on delete**: Add Model observer or delete event to remove files when form is deleted.

### Storage Disk Choice
- **Local** (`storage/app/public`): Development, testing. Serve via symlink `php artisan storage:link`.
- **S3**: Production. Configure via `.env` (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, `AWS_REGION`).

### Frontend Integration
- Use `FormData` for multipart uploads (React):
  ```js
  const formData = new FormData();
  formData.append('evidence', fileInput.files[0]);
  await api.post(`/api/submission-forms/${id}/upload-evidence`, formData);
  ```
- Render: `<img src={form.evidence_photo_url} alt="Evidence" />`

---

## Conventions & Patterns

**Eloquent models**:
- Use `HasFactory`, `HasMany`, `BelongsTo` relationships
- Cast dates/decimals: `protected function casts(): array`
- No static timestamps for Pivot tables (if used)

**API responses**:
- Return model instances (Laravel handles JSON serialization)
- Load relationships eagerly: `$form->load('items', 'creator', 'plant')`
- Blade doesn't apply; API-only

**Auth**:
- Routes use `middleware('auth:sanctum')`
- `$request->user()` gets authenticated user
- Token set in frontend via `api.js` (Axios interceptor)

**Testing**:
- Feature tests in `tests/Feature/`; see `SubmissionApiTest.php` for patterns
- Use `$this->actingAs($user)` to bypass auth in tests

**Database**:
- SQLite for dev; migrations run automatically in tests
- Foreign keys enforced (cascadeOnDelete, restrictOnDelete, nullOnDelete)
- Seeders in `database/seeders/` (auto-wired to migrations)

---

## Common Tasks

| Task | Command |
|------|---------|
| Create migration | `php artisan make:migration create_xxx_table` |
| Create model + migration | `php artisan make:model Xxx -m` |
| Create controller | `php artisan make:controller Api/XxxController` |
| Run tests | `php artisan test` or `php artisan test tests/Feature/SomeTest.php` |
| Seed database | `php artisan migrate --seed` |
| Clear cache | `php artisan cache:clear` |
| Tinker REPL | `php artisan tinker` |

---

## Gotchas & Tips

- **Frontend auth**: Token stored in `localStorage` as `authToken`; set in `api.js` before any API call.
- **CORS**: Configured in `config/cors.php`; allow frontend URL.
- **File symlink**: After `php artisan storage:link`, files in `storage/app/public` are served at `/storage/...`
- **Migrations run on serve**: Use `php artisan migrate --seed` explicitly if needed.
- **Test isolation**: Each test gets fresh DB; seeders NOT auto-run in tests—use factories or manually call seeders.
- **Sanctum tokens**: Revoked on logout; create new token on login (see `AuthController`).
- **No SoftDeletes yet**: Hard deletes cascade/restrict per migration; consider SoftDeletes for audit if needed later.
