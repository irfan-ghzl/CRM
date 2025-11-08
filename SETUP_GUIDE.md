# Panduan Setup & Deployment

## Prerequisites

### Untuk Development Lokal:
- Node.js v18 atau lebih tinggi
- PostgreSQL 15 atau lebih tinggi
- npm atau yarn

### Untuk Docker Deployment:
- Docker
- Docker Compose

## Cara 1: Setup dengan Docker (Paling Mudah)

### 1. Clone Repository
```bash
git clone <repository-url>
cd CRM
```

### 2. Jalankan dengan Docker Compose
```bash
docker-compose up -d
```

### 3. Akses Aplikasi
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### 4. Login dengan Akun Admin Default
- Username: `admin`
- Password: `admin123`

### 5. Stop Aplikasi
```bash
docker-compose down
```

### 6. Reset Database (Hapus Semua Data)
```bash
docker-compose down -v
docker-compose up -d
```

## Cara 2: Setup Manual (Development)

### A. Setup Database PostgreSQL

#### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# macOS dengan Homebrew
brew install postgresql
brew services start postgresql

# Windows
# Download installer dari https://www.postgresql.org/download/windows/
```

#### 2. Buat Database
```bash
sudo -u postgres psql
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
\q
```

**⚠️ Catatan Keamanan**: Gunakan password yang kuat dan simpan dengan aman. Jangan gunakan username/password default dalam produksi.

### B. Setup Backend

#### 1. Masuk ke Direktori Backend
```bash
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi Anda:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USER=crm_user
DB_PASSWORD=your_strong_password_here

JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

#### 4. Jalankan Migrasi Database
```bash
npm run migrate
```

Output yang diharapkan:
```
Database connected successfully
All tables created successfully
Seed data inserted successfully
Migration completed successfully
```

#### 5. Jalankan Backend Server
```bash
# Production mode
npm start

# Development mode (dengan nodemon)
npm run dev
```

Server akan berjalan di: http://localhost:5000

### C. Setup Frontend

#### 1. Masuk ke Direktori Frontend
```bash
cd ../frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 4. Jalankan Frontend
```bash
npm start
```

Aplikasi akan terbuka di: http://localhost:3000

## Testing API dengan Postman/cURL

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User Baru
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "nama_lengkap": "Test User",
    "no_telepon": "081234567890",
    "alamat": "Jl. Test No. 123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Simpan token dari response untuk request berikutnya.

### 4. Get Kategori
```bash
curl http://localhost:5000/api/kategori
```

### 5. Buat Pengaduan (dengan token)
```bash
curl -X POST http://localhost:5000/api/pengaduan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "judul": "Jalan Rusak",
    "isi_pengaduan": "Jalan di area perumahan mengalami kerusakan parah",
    "lokasi": "Jl. Merdeka No. 45",
    "kategori_id": 1,
    "prioritas": 2
  }'
```

## Struktur Database

Setelah migrasi, database akan memiliki tabel-tabel berikut:

- **users**: Pengguna (masyarakat, petugas, admin)
- **kategori**: Kategori pengaduan
- **pengaduan**: Data pengaduan
- **file_bukti**: File lampiran
- **tanggapan**: Tanggapan dari petugas
- **rating**: Rating kepuasan
- **notifikasi**: Notifikasi pengguna
- **status_history**: Riwayat perubahan status

## Default Accounts

Setelah migrasi, tersedia akun berikut:

### Admin
- Username: `admin`
- Password: `admin123`
- Role: admin

**⚠️ PENTING**: Ganti password default setelah login pertama!

## Roles & Permissions

### Masyarakat (Public)
- Registrasi akun
- Membuat pengaduan
- Melihat pengaduan sendiri
- Update/hapus pengaduan sendiri (status pending)
- Memberikan rating

### Petugas (Officer)
- Login dengan akun yang dibuat admin
- Melihat semua pengaduan
- Memberikan tanggapan
- Update status pengaduan
- Menangani pengaduan yang di-assign

### Admin
- Semua akses petugas
- Mengelola pengguna
- Mengelola kategori
- Assign pengaduan ke petugas
- Melihat statistik dan laporan
- Kelola sistem

## Troubleshooting

### Backend tidak bisa connect ke database
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Port sudah digunakan
```bash
# Check port 5000
lsof -i :5000
# Kill process
kill -9 PID

# Check port 3000
lsof -i :3000
```

### Reset Database
```bash
cd backend
psql -U postgres -d postgres
DROP DATABASE crm_db;
CREATE DATABASE crm_db;
\q
npm run migrate
```

### Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### 1. Update Environment Variables
Set production values:
```env
NODE_ENV=production
JWT_SECRET=use-strong-random-secret-minimum-32-characters
DB_PASSWORD=use-very-strong-password-here
```

**⚠️ Keamanan Penting**:
- JWT_SECRET harus minimal 32 karakter, gunakan random string
- Gunakan password database yang kuat (minimal 16 karakter, kombinasi huruf, angka, simbol)
- Jangan commit file .env ke repository

### 2. Build Frontend
```bash
cd frontend
npm run build
```

### 3. Deploy dengan Docker
```bash
docker-compose -f docker-compose.yml up -d --build
```

### 4. Setup Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Setup SSL dengan Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring & Logs

### Docker Logs
```bash
# Backend logs
docker logs crm-backend -f

# Frontend logs
docker logs crm-frontend -f

# PostgreSQL logs
docker logs crm-postgres -f
```

### Manual Logs
```bash
# Backend logs
cd backend
tail -f *.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/*.log
```

## Backup & Restore Database

### Backup
```bash
# Dengan Docker
docker exec crm-postgres pg_dump -U postgres crm_db > backup.sql

# Manual
pg_dump -U postgres -d crm_db -F c -f backup.dump
```

### Restore
```bash
# Dengan Docker
docker exec -i crm-postgres psql -U postgres -d crm_db < backup.sql

# Manual
pg_restore -U postgres -d crm_db backup.dump
```

## Support

Jika mengalami masalah, silakan buat issue di GitHub repository atau hubungi administrator sistem.
