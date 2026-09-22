# 🚀 Panduan Workflow: Dari Laptop ke GitHub hingga Server Linux

Dokumen ini adalah panduan praktis alur kerja pengubahan kode dari laptop lokal Anda (development) sampai terpasang di server Linux (production).

---

## 🗺️ Gambaran Alur Kerja

```text
[ 1. Laptop Anda ]                 [ 2. GitHub ]                  [ 3. Server Linux ]
(Coding di VS Code)              (Penyimpan Kode)             (Docker / 192.168.160.181)
        │                               │                                │
        │── git commit & git push ─────>│                                │
        │                               │── git pull & docker rebuild ──>│
```

---

## 💻 LANGKAH 1: Kembangkan & Uji Coba di Laptop

1. **Jalankan Aplikasi Lokal (Hot Reload)**:
   - **Terminal 1 (Backend)**:
     ```powershell
     cd backend
     php artisan serve
     ```
   - **Terminal 2 (Frontend)**:
     ```powershell
     cd frontend
     npm start
     ```
2. **Buka di Browser**: `http://localhost:3000`
3. Edit file / buat fitur baru sesuai kebutuhan. Perubahan akan langsung terlihat di browser tanpa perlu refresh/restart berulang-ulang.

---

## 📤 LANGKAH 2: Simpan & Kirim Perubahan ke GitHub

Setelah fitur selesai dibuat dan berfungsi normal di laptop:

1. Buka Terminal di VS Code (pastikan di folder root project).
2. Jalankan perintah berikut:

```powershell
# 1. Cek file mana saja yang berubah
git status

# 2. Tandai file yang diubah
git add backend/ frontend/

# 3. Beri catatan apa yang diubah
git commit -m "feat: deskripsi singkat perubahan apa yang dibuat"

# 4. Kirim (upload) ke GitHub
git push origin main
```

---

## 📥 LANGKAH 3: Terapkan Perubahan ke Server Linux

1. **Masuk ke Server Linux via SSH**:
   ```bash
   ssh agent@192.168.160.181
   ```

2. **Masuk ke folder project**:
   ```bash
   cd /opt/skda-waste-management
   ```

3. **Jalankan Update Otomatis**:
   ```bash
   # Ambil kode terbaru dari GitHub
   git pull origin main

   # Build ulang dan jalankan container yang diperbarui
   docker compose up -d --build
   ```

4. *(Opsional)* Jika ada perubahan struktur tabel / migrasi database baru di Laravel:
   ```bash
   docker compose exec backend php artisan migrate --force
   ```

5. **Buka di Browser**:
   Kunjungi `http://192.168.160.181:8081` lalu tekan `Ctrl + Shift + R` (atau `Ctrl + F5`) untuk membersihkan cache browser.

---

## ⚡ Tips Praktis (Supaya Lebih Cepat)

### Buat Script Update 1 Baris di Server:
Di server Linux, Anda bisa membuat file `update.sh` agar setiap update cukup menjalankan `./update.sh`:

```bash
cat << 'EOF' > /opt/skda-waste-management/update.sh
#!/bin/bash
set -e
echo "🔄 Mengambil kode terbaru dari GitHub..."
git pull origin main

echo "🏗️ Memperbarui container Docker..."
docker compose up -d --build

echo "📦 Menjalankan migrasi database (jika ada)..."
docker compose exec -T backend php artisan migrate --force

echo "🧹 Membersihkan cache Laravel..."
docker compose exec -T backend php artisan optimize:clear

echo "✅ Selesai! Aplikasi berhasil diupdate di http://192.168.160.181:8081"
EOF

chmod +x /opt/skda-waste-management/update.sh
```

**Setelah script di atas dibuat, ke depannya di server cukup jalankan:**
```bash
cd /opt/skda-waste-management && ./update.sh
```

---

## 🛠️ Ringkasan Perintah (Cheatsheet Cepat)

| Lokasi | Perintah | Fungsi |
|---|---|---|
| **Laptop** | `git add backend/ frontend/` | Menandai perubahan file |
| **Laptop** | `git commit -m "pesan perubahan"` | Menyimpan riwayat perubahan lokal |
| **Laptop** | `git push origin main` | Mengirim perubahan ke GitHub |
| **Server** | `git pull origin main` | Mengambil perubahan dari GitHub ke Server |
| **Server** | `docker compose up -d --build` | Rebuild dan pasang update di Docker |
| **Server** | `docker compose ps` | Cek status container (pastikan semua Up) |
| **Server** | `docker compose logs -f backend` | Cek error/log backend secara live |
