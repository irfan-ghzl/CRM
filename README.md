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

## 👤 Default Admin Account

Setelah migrasi, gunakan akun berikut untuk login sebagai admin:

- Username: `admin`
- Password: `admin123`

⚠️ **Penting**: Ganti password default setelah login pertama!

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

## 🔒 Security

- Password di-hash menggunakan bcryptjs
- JWT untuk autentikasi
- Role-based access control
- Input validation
- SQL injection prevention dengan parameterized queries

## 📝 License

MIT