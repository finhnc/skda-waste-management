# SKDA Waste Management

## Arsitektur

- Backend: Laravel 13, PHP 8.3, SQLite untuk development
- Frontend: React 18, Create React App, Axios, Lucide React
- API auth: Laravel Sanctum
- Frontend URL: http://localhost:3000
- Backend URL: http://127.0.0.1:8000

## Fitur Yang Sudah Ada

- Login dan logout dengan token Sanctum
- Sesi login tersimpan di localStorage
- Dashboard daftar form dan ringkasan statistik
- Buat form penyerahan sampah
- Tambah, ubah, dan hapus item sampah
- Edit form tersimpan ke database
- Detail form
- Cetak form A4
- Export Excel `.xlsx` dengan format dasar
- Login animated sementara melalui `ENABLE_ANIMATED_LOGIN` di `frontend/src/App.js`
- Layout responsif untuk login, dashboard, dan form

## Endpoint API

- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`
- `GET /api/submission-forms`
- `POST /api/submission-forms`
- `GET /api/submission-forms/{id}`
- `PUT/PATCH /api/submission-forms/{id}`
- `PATCH /api/submission-forms/{id}/approval`

## Data Utama

- `users`
- `plants`
- `departments`
- `waste_categories`
- `submission_forms`
- `submission_items`
- `approvals`

## Perintah Menjalankan

Backend:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```powershell
cd frontend
npm start
```

Validasi:

```powershell
cd backend
php artisan test

cd ..\frontend
npm run build
```

## Akun Development

- Email: `operator@skda.test`
- Password: `password`

## Backup

Backup source terakhir berada di folder sibling:

`C:\Users\FinHNC-NB\skda-waste-management-backups`

## Langkah Berikutnya

- Uji export Excel dari halaman Detail
- Tambahkan approval berdasarkan role
- Tambahkan API dan UI master data
- Tambahkan PDF server-side bila diperlukan
- Pertimbangkan migrasi SQLite ke MySQL untuk production