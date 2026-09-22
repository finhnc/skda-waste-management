# SKDA Waste Management — Copilot Instructions

## 🚀 Quick Start

**Stack**: Laravel 11 (PHP 8.1+) backend + React 18 (Create React App) frontend  
**Auth**: Laravel Sanctum tokens, stored in `localStorage` as `authToken`  
**Frontend URL**: `http://localhost:3000`  
**Backend URL**: `http://127.0.0.1:8000`

### Run both servers

**Terminal 1 — Backend:**
```powershell
cd backend
composer install          # if first time
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install               # if first time
npm start
```

### Single commands

| Task | Command |
|------|---------|
| Run backend tests | `cd backend && php artisan test` |
| Run single test file | `cd backend && php artisan test tests/Feature/SomeTest.php` |
| Build frontend for production | `cd frontend && npm run build` |
| Seed database | `cd backend && php artisan migrate --seed` |
| Clear backend cache | `cd backend && php artisan cache:clear` |
| Tinker (PHP REPL) | `cd backend && php artisan tinker` |
| Lint code (Pint) | `cd backend && ./vendor/bin/pint` |

**Dev account**: `operator@skda.test` / `password`

---

## 🏗️ Architecture

**Laravel RESTful API** ↔ **React SPA**  
All API routes are under `/api/*` in `routes/api.php`. The React app makes Axios requests to `127.0.0.1:8000` (configured in `frontend/src/api.js`).

### Key Backend Files
- **Models**: `app/Models/{User, Plant, Department, WasteCategory, SubmissionForm, SubmissionItem, Approval}`
- **Controllers**: `app/Http/Controllers/Api/{AuthController, SubmissionFormController}`
- **Routes**: `routes/api.php`
- **Migrations**: `database/migrations/`
- **Seeders**: `database/seeders/`
- **Tests**: `tests/Feature/`

### Key Frontend Structure
- `frontend/src/App.js` — Main component with routing
- `frontend/src/api.js` — Axios instance with Sanctum token interceptor
- `frontend/src/components/` — Reusable React components

### Database Models & Relationships
- `users` → has many `submission_forms`, `approvals`
- `plants` → has many `submission_forms`
- `departments` → has many `submission_forms`
- `waste_categories` → has many `submission_items`
- `submission_forms` → belongs to user/plant/department; has many `submission_items` and `approvals`
- `submission_items` → belongs to `submission_form` and `waste_category`
- `approvals` → tracks multi-level approval workflow

---

## 📐 Conventions

### Backend (Laravel)

- **Eloquent models** use `HasFactory`, `HasMany`, `BelongsTo` relationships
- **Dates/decimals** cast via `protected function casts(): array`
- **API responses** return model instances (auto-JSON); eagerly load relationships: `$form->load('items', 'creator', 'plant')`
- **Auth routes** use `middleware('auth:sanctum')`; authenticated user via `$request->user()`
- **Foreign key constraints**: `cascadeOnDelete`, `restrictOnDelete`, `nullOnDelete`
- **No SoftDeletes** currently; hard deletes only
- **Tests** use `$this->actingAs($user)` to bypass Sanctum auth; seeders are NOT auto-run in tests—use factories or call manually
- **File storage**: `storage/app/public` (dev) or `s3` (production); symlink with `php artisan storage:link`
- **Admin authorization**: Uses Laravel Gates with `can:admin` middleware on routes; `Gate::define('admin', fn($user) => $user->hasRole('admin'))` in `AppServiceProvider`; User model has `hasRole(string $role): bool` method
- **Role values**: `admin` or `operator` stored in `role` column

### Frontend (React)

- Create React App (react-scripts 5.0.1); scripts are `start`, `build`, `test`
- **Auth token**: Stored in `localStorage` as `authToken`; set in `api.js` interceptor before every API call
- **Login animated**: Controlled by `ENABLE_ANIMATED_LOGIN` flag in `frontend/src/App.js`
- **Export**: Excel (`.xlsx`) via frontend; no server-side PDF yet
- **Responsive layout** for login, dashboard, and form pages

### Adding Image/File Uploads (Pattern)

When adding file support, follow this established pattern:
1. Migration: `string` column for file path (e.g., `evidence_photo_path`)
2. Model: add to `$fillable`
3. Endpoint: validate `image|mimes:jpeg,png,jpg|max:5120`, store via `Storage::disk('public')->putFile()`
4. Return full URL in API response
5. Cleanup on delete via Model observer

---

## 📚 Additional Context

- See `.hermes.md` for feature roadmap and development priorities
- See `backend/CLAUDE.md` for detailed Laravel-specific guidelines
- See `backend/AGENTS.md` for agent-level task guidance
- See `PROJECT_STATUS.md` for current feature status and next steps
- See `backend/composer.json` for dependency versions (Laravel 11, Sanctum, PHP 8.1+)