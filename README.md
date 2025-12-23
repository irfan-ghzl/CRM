# CRM - Sistem Pengaduan Masyarakat (E-Government)

Sistem Pengaduan Masyarakat berbasis web untuk E-Government dengan backend Node.js/Express dan frontend React.

## 📋 Fitur

### Untuk Masyarakat:
- Registrasi dan Login
- Membuat pengaduan baru
- Melihat status pengaduan
- Update dan hapus pengaduan
- Menerima notifikasi

### Untuk Petugas:
- Login
- Melihat dan mengelola pengaduan
- Memberikan tanggapan
- Update status pengaduan

### Untuk Admin:
- Kelola pengguna
- Kelola kategori
- Lihat statistik dan laporan
- Assign pengaduan ke petugas

## 🏗️ Teknologi

### Backend:
- Node.js & Express
- PostgreSQL
- JWT Authentication
- bcryptjs

### Frontend:
- React 18
- React Router v6
- Axios

## 🚀 Instalasi

### Dengan Docker (Recommended)

1. Clone repository:
```bash
git clone <repository-url>
cd CRM
```

2. Jalankan dengan Docker Compose:
```bash
docker-compose up -d
```

3. Aplikasi akan berjalan di:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432

### Manual Installation

#### Backend

1. Masuk ke direktori backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy dan edit file environment:
```bash
cp .env.example .env
```

4. Setup database PostgreSQL dan jalankan migrasi:
```bash
npm run migrate
```

5. Jalankan server:
```bash
npm start
# atau untuk development
npm run dev
```

#### Frontend

1. Masuk ke direktori frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy dan edit file environment:
```bash
cp .env.example .env
```

4. Jalankan aplikasi:
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### User Management (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/petugas` - List petugas users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (any role)
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/password` - Change user password
- `DELETE /api/users/:id` - Delete user

### Pengaduan
- `GET /api/pengaduan` - List pengaduan
- `POST /api/pengaduan` - Buat pengaduan baru
- `GET /api/pengaduan/:id` - Detail pengaduan
- `PUT /api/pengaduan/:id` - Update pengaduan
- `DELETE /api/pengaduan/:id` - Hapus pengaduan
- `PUT /api/pengaduan/:id/status` - Update status
- `PUT /api/pengaduan/:id/assign` - Assign ke petugas
- `GET /api/pengaduan/statistics` - Statistik

### Kategori
- `GET /api/kategori` - List kategori
- `POST /api/kategori` - Buat kategori (admin)
- `PUT /api/kategori/:id` - Update kategori (admin)
- `DELETE /api/kategori/:id` - Hapus kategori (admin)

### Tanggapan
- `POST /api/tanggapan` - Buat tanggapan (petugas/admin)
- `GET /api/tanggapan/pengaduan/:id` - Get tanggapan by pengaduan

### Notifikasi
- `GET /api/notifikasi` - List notifikasi
- `PUT /api/notifikasi/:id/read` - Mark as read
- `PUT /api/notifikasi/read-all` - Mark all as read

## 👤 Default Accounts

Setelah migrasi, gunakan akun berikut untuk login:

### Admin Account
- Username: `admin`
- Password: `admin123`

### Petugas Accounts (untuk testing)
**Petugas 1 - Infrastruktur:**
- Username: `petugas1`
- Password: `Petugas123`
- Divisi: Infrastruktur
- NIP: 198901012020011001

**Petugas 2 - Kebersihan:**
- Username: `petugas2`
- Password: `Petugas123`
- Divisi: Kebersihan
- NIP: 198902022020022002

⚠️ **Penting**: Ganti password default setelah login pertama!

### 🔄 Jika Petugas Tidak Muncul di Database

Jika setelah migrasi hanya ada akun admin (tanpa petugas), jalankan migrasi lagi:

**Untuk Docker (PENTING - Rebuild image):**
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

**Atau rebuild semua sekaligus:**
```bash
docker-compose down
docker-compose up -d --build
```

**Catatan:** `docker-compose up -d` saja TIDAK akan rebuild image. Gunakan `--build` flag atau `docker-compose build` untuk mendapatkan kode terbaru.

**Untuk Manual Installation:**
```bash
cd backend
npm install  # Pastikan dependencies terinstall
npm run migrate
```

**Verifikasi akun sudah dibuat:**
```bash
docker exec -it crm-postgres psql -U postgres -d crm_db -c "SELECT username, role FROM users;"
```

Harusnya muncul:
- admin (admin)
- petugas1 (petugas)  
- petugas2 (petugas)

Migrasi akan otomatis mengecek dan menambahkan akun petugas jika belum ada, tanpa menghapus data yang sudah ada.

## 👥 Membuat dan Login sebagai Petugas

### Login dengan Akun Petugas yang Sudah Ada:

Sistem sudah menyediakan 2 akun petugas untuk testing (lihat bagian "Default Accounts" di atas):
- `petugas1` (Divisi Infrastruktur) - Password: `Petugas123`
- `petugas2` (Divisi Kebersihan) - Password: `Petugas123`

Untuk login:
1. Buka halaman login
2. Masukkan username dan password di atas
3. Klik "Login"

### Cara Membuat Akun Petugas Baru:

1. **Login sebagai Admin** menggunakan kredensial default di atas
2. **Klik menu "Kelola User"** di navbar (hanya muncul untuk admin)
3. **Klik tombol "Tambah User Baru"**
4. **Isi form dengan data petugas:**
   - Username: contoh `petugas1`
   - Email: contoh `petugas1@crm.com`
   - Password: minimal 8 karakter (huruf besar, kecil, angka), contoh `Petugas123`
   - Nama Lengkap: contoh `Petugas Infrastruktur`
   - **Role: pilih "Petugas"** (penting!)
   - NIP: contoh `198901012020011001`
   - Divisi: contoh `Infrastruktur`
   - No. Telepon & Alamat (opsional)
5. **Klik "Tambah"** untuk membuat user petugas

### Cara Login sebagai Petugas:

1. **Logout** dari akun admin (klik tombol Logout di navbar)
2. Di halaman login, masukkan:
   - Username: `petugas1` (atau username yang dibuat)
   - Password: `Petugas123` (atau password yang dibuat)
3. **Klik "Login"**

### Cara Mengetahui Login sebagai Petugas:

Setelah login berhasil, Anda akan melihat beberapa indikator bahwa Anda login sebagai petugas:

1. **Di Navbar (pojok kanan atas):**
   - Akan tertulis: `[Nama Lengkap] (petugas)`
   - Contoh: `Petugas Infrastruktur (petugas)`

2. **Menu yang tersedia:**
   - ✅ Dashboard - menampilkan statistik pengaduan
   - ✅ Pengaduan - melihat pengaduan yang di-assign ke petugas
   - ❌ Buat Pengaduan - TIDAK ada (hanya untuk masyarakat)
   - ❌ Kelola User - TIDAK ada (hanya untuk admin)

3. **Di Dashboard:**
   - Menampilkan statistik total pengaduan dan status
   - Menampilkan pengaduan terbaru yang perlu ditangani

4. **Fitur yang tersedia untuk Petugas:**
   - Review dan validasi pengaduan
   - Update status pengaduan (pending → diproses → selesai/ditolak)
   - Membuat tanggapan untuk pengaduan
   - Melihat pengaduan yang di-assign kepada petugas tersebut

## 📊 Database Schema

Sistem menggunakan PostgreSQL dengan tabel-tabel berikut:
- `users` - Data pengguna (masyarakat, petugas, admin)
- `pengaduan` - Data pengaduan
- `kategori` - Kategori pengaduan
- `file_bukti` - File lampiran bukti
- `tanggapan` - Tanggapan petugas
- `rating` - Rating pengaduan
- `notifikasi` - Notifikasi pengguna
- `status_history` - Riwayat perubahan status

## 📖 Dokumentasi Diagram

- [Diagram UML (Mermaid)](DIAGRAMS.md) - Berisi Use Case, Activity, Sequence, dan Class Diagram

### Diagram yang Tersedia:

1. **Use Case Diagram** - Interaksi antara aktor dengan sistem
2. **Activity Diagram** - Alur proses pengajuan dan penanganan pengaduan
3. **Sequence Diagram** - Interaksi antar komponen sistem
4. **Class Diagram** - Struktur data dan relasi antar kelas

## 🌐 Staging Deployment

### Frontend (GitHub Pages)
Aplikasi frontend secara otomatis di-deploy ke GitHub Pages sebagai staging environment ketika ada push ke branch `main`.

- **URL Staging**: https://irfan-ghzl.github.io/CRM
- **Workflow**: `.github/workflows/staging-deploy.yml`

#### Setup GitHub Pages:
1. Buka Settings repository > Pages
2. Pilih "GitHub Actions" sebagai source

### Backend & Database (Docker)
Backend dan database menggunakan Docker images yang otomatis di-build dan push ke GitHub Container Registry (GHCR).

#### Docker Images:
- **Backend**: `ghcr.io/irfan-ghzl/crm/backend:latest`
- **Frontend**: `ghcr.io/irfan-ghzl/crm/frontend:latest`

#### Deploy ke Server Staging:

1. **Login ke GHCR** (di server staging):
```bash
# Ganti YOUR_GITHUB_USERNAME dengan username GitHub Anda
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

2. **Setup environment variables**:
```bash
# Copy file template
cp .env.staging.example .env.staging

# Edit dengan nilai yang sesuai
nano .env.staging
```

3. **Jalankan dengan Docker Compose Staging**:
```bash
docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d
```

#### Koneksi Database di Staging:

**Opsi 1: Database di Docker (Sudah termasuk)**
- Database PostgreSQL sudah termasuk dalam `docker-compose.staging.yml`
- Backend otomatis konek ke database via Docker network
- Data disimpan di volume `postgres_staging_data`

**Opsi 2: External Database (Railway, Supabase, Neon, dll)**
1. Buat database di platform pilihan Anda
2. Dapatkan connection string/credentials
3. Update `.env.staging`:
```env
DB_HOST=your-external-db-host.railway.app
DB_PORT=5432
DB_NAME=crm_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```
4. Comment/hapus service `postgres` di `docker-compose.staging.yml`

**Koneksi Database Manual (untuk debugging)**:
```bash
# Via Docker
docker exec -it crm-postgres-staging psql -U postgres -d crm_db

# Via psql (jika terinstall) - port 15432 untuk staging
psql -h localhost -p 15432 -U postgres -d crm_db
```

#### Deploy ke Cloud Platform:
Docker images dapat di-deploy ke berbagai platform:
- **Railway.app**: Import langsung dari GitHub (termasuk PostgreSQL gratis)
- **Render.com**: Connect GitHub repository + PostgreSQL add-on
- **DigitalOcean App Platform**: Deploy dari container registry
- **AWS ECS/Fargate**: Push ke ECR atau gunakan GHCR
- **Google Cloud Run**: Deploy container image + Cloud SQL

#### Konfigurasi Environment Variables:
Untuk staging/production, set environment variables berikut di server:

**Backend**:
```env
NODE_ENV=production
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=crm_db
DB_USER=your-db-user
# Gunakan password yang kuat (min 16 karakter, kombinasi huruf, angka, simbol)
DB_PASSWORD=your-secure-password-here
# Generate JWT secret dengan: openssl rand -base64 32
JWT_SECRET=your-generated-jwt-secret
JWT_EXPIRES_IN=7d
PORT=5000
```

**Frontend**:
```env
REACT_APP_API_URL=https://your-backend-url/api
```

### GitHub Actions Variables:
Konfigurasi di Settings > Secrets and variables > Actions:
- `STAGING_API_URL`: URL backend API untuk frontend staging

## 🔒 Security

- Password di-hash menggunakan bcryptjs
- JWT untuk autentikasi
- Role-based access control
- Input validation
- SQL injection prevention dengan parameterized queries

## 📝 License

MIT