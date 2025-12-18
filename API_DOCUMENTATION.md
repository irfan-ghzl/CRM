# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Semua endpoint (kecuali login, register, dan get kategori) memerlukan JWT token dalam header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

## Endpoints

### 1. Authentication

#### Register
```
POST /api/auth/register
```

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "nama_lengkap": "string",
  "no_telepon": "string",
  "alamat": "string",
  "nik": "string"
}
```

**Response:**
```json
{
  "message": "Registrasi berhasil",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "nama_lengkap": "User Name",
    "role": "masyarakat"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "jwt-token",
  "user": { ... }
}
```

#### Get Profile
```
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "nama_lengkap": "User Name",
  "no_telepon": "081234567890",
  "alamat": "Address",
  "role": "masyarakat",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### Update Profile
```
PUT /api/auth/profile
```

**Body:**
```json
{
  "nama_lengkap": "string",
  "no_telepon": "string",
  "alamat": "string"
}
```

### 2. Pengaduan

#### List Pengaduan
```
GET /api/pengaduan?status=pending&page=1&limit=10
```

**Query Parameters:**
- `status` (optional): pending, diproses, selesai, ditolak
- `kategori_id` (optional): integer
- `page` (optional): integer (default: 1)
- `limit` (optional): integer (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nomor_pengaduan": "ADU-202401-0001",
      "judul": "Jalan Rusak",
      "isi_pengaduan": "...",
      "lokasi": "Jl. Merdeka",
      "status": "pending",
      "prioritas": 2,
      "nama_kategori": "Infrastruktur",
      "nama_pelapor": "John Doe",
      "tanggal_pengaduan": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Create Pengaduan
```
POST /api/pengaduan
```

**Body:**
```json
{
  "judul": "string",
  "isi_pengaduan": "string",
  "lokasi": "string",
  "kategori_id": "integer",
  "prioritas": "integer (1-3)"
}
```

**Response:**
```json
{
  "message": "Pengaduan berhasil dibuat",
  "data": { ... }
}
```

#### Get Pengaduan Detail
```
GET /api/pengaduan/:id
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "nomor_pengaduan": "ADU-202401-0001",
    "judul": "...",
    "isi_pengaduan": "...",
    "lokasi": "...",
    "status": "pending",
    "nama_kategori": "...",
    "nama_pelapor": "...",
    "file_bukti": [],
    "tanggapan": null,
    "rating": null,
    "history": []
  }
}
```

#### Update Pengaduan
```
PUT /api/pengaduan/:id
```

**Body:**
```json
{
  "judul": "string",
  "isi_pengaduan": "string",
  "lokasi": "string",
  "kategori_id": "integer"
}
```

#### Delete Pengaduan
```
DELETE /api/pengaduan/:id
```

#### Update Status (Admin/Petugas Only)
```
PUT /api/pengaduan/:id/status
```

**Body:**
```json
{
  "status": "pending|diproses|selesai|ditolak",
  "keterangan": "string (optional)"
}
```

#### Assign Petugas (Admin Only)
```
PUT /api/pengaduan/:id/assign
```

**Body:**
```json
{
  "petugas_id": "integer"
}
```

#### Get Statistics (Admin/Petugas Only)
```
GET /api/pengaduan/statistics
```

**Response:**
```json
{
  "total": 100,
  "byStatus": [
    { "status": "pending", "count": "30" },
    { "status": "diproses", "count": "40" },
    { "status": "selesai", "count": "25" },
    { "status": "ditolak", "count": "5" }
  ],
  "byKategori": [
    { "nama_kategori": "Infrastruktur", "count": "50" },
    { "nama_kategori": "Kebersihan", "count": "30" }
  ],
  "recent": []
}
```

### 3. Kategori

#### List Kategori
```
GET /api/kategori
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama_kategori": "Infrastruktur",
      "deskripsi": "...",
      "icon": "build",
      "is_active": true
    }
  ]
}
```

#### Create Kategori (Admin Only)
```
POST /api/kategori
```

**Body:**
```json
{
  "nama_kategori": "string",
  "deskripsi": "string",
  "icon": "string"
}
```

#### Update Kategori (Admin Only)
```
PUT /api/kategori/:id
```

**Body:**
```json
{
  "nama_kategori": "string",
  "deskripsi": "string",
  "icon": "string",
  "is_active": "boolean"
}
```

#### Delete Kategori (Admin Only)
```
DELETE /api/kategori/:id
```

### 4. Tanggapan

#### Create Tanggapan (Admin/Petugas Only)
```
POST /api/tanggapan
```

**Body:**
```json
{
  "pengaduan_id": "integer",
  "isi_tanggapan": "string"
}
```

**Response:**
```json
{
  "message": "Tanggapan berhasil dibuat",
  "data": {
    "id": 1,
    "pengaduan_id": 1,
    "petugas_id": 2,
    "isi_tanggapan": "...",
    "tanggal_tanggapan": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Tanggapan by Pengaduan
```
GET /api/tanggapan/pengaduan/:pengaduan_id
```

### 5. Notifikasi

#### List Notifikasi
```
GET /api/notifikasi?page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "judul": "Pengaduan Baru",
      "pesan": "...",
      "tipe": "pengaduan_baru",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unread": 5,
  "pagination": { ... }
}
```

#### Mark as Read
```
PUT /api/notifikasi/:id/read
```

#### Mark All as Read
```
PUT /api/notifikasi/read-all
```

## Rate Limiting

### Auth Endpoints (Login/Register)
- **Limit**: 5 requests per 15 minutes
- **Response** (when exceeded):
```json
{
  "message": "Terlalu banyak percobaan login, coba lagi setelah 15 menit"
}
```

### General API Endpoints
- **Limit**: 100 requests per 15 minutes
- **Response** (when exceeded):
```json
{
  "message": "Terlalu banyak request dari IP ini, coba lagi setelah 15 menit"
}
```

### Create Pengaduan
- **Limit**: 10 requests per hour
- **Response** (when exceeded):
```json
{
  "message": "Terlalu banyak pengaduan dibuat, coba lagi setelah 1 jam"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Example Usage

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Create Pengaduan
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/pengaduan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "judul": "Jalan Rusak",
    "isi_pengaduan": "Jalan di area perumahan rusak parah",
    "lokasi": "Jl. Merdeka No. 45",
    "kategori_id": 1,
    "prioritas": 2
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Login
const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

// Create Pengaduan
const createPengaduan = async (token, data) => {
  const response = await api.post('/pengaduan', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

## Role-Based Access

### Masyarakat (Public)
- ✅ Register & Login
- ✅ Create/Read/Update/Delete own pengaduan
- ✅ View own notifications
- ✅ Rate completed pengaduan

### Petugas (Officer)
- ✅ Login
- ✅ View all assigned pengaduan
- ✅ Update pengaduan status
- ✅ Create tanggapan
- ✅ View notifications

### Admin
- ✅ All petugas permissions
- ✅ View all pengaduan
- ✅ Manage users
- ✅ Manage categories
- ✅ Assign pengaduan to petugas
- ✅ View statistics

## User Management (Admin Only)

### Get All Users
```
GET /api/users?role=petugas&page=1&limit=10
```

**Query Parameters:**
- `role` (optional): masyarakat, petugas, admin
- `page` (optional): integer (default: 1)
- `limit` (optional): integer (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 2,
      "username": "petugas1",
      "email": "petugas1@crm.com",
      "nama_lengkap": "Petugas Satu",
      "no_telepon": "081234567890",
      "alamat": "Address",
      "role": "petugas",
      "nip": "198901012020011001",
      "divisi": "Infrastruktur",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Petugas List
```
GET /api/users/petugas
```

**Response:**
```json
{
  "data": [
    {
      "id": 2,
      "username": "petugas1",
      "nama_lengkap": "Petugas Satu",
      "nip": "198901012020011001",
      "divisi": "Infrastruktur"
    }
  ]
}
```

### Get User by ID
```
GET /api/users/:id
```

**Response:**
```json
{
  "data": {
    "id": 2,
    "username": "petugas1",
    "email": "petugas1@crm.com",
    "nama_lengkap": "Petugas Satu",
    "no_telepon": "081234567890",
    "alamat": "Address",
    "role": "petugas",
    "nip": "198901012020011001",
    "divisi": "Infrastruktur",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create User
```
POST /api/users
```

**Body:**
```json
{
  "username": "petugas1",
  "email": "petugas1@crm.com",
  "password": "password123",
  "nama_lengkap": "Petugas Satu",
  "no_telepon": "081234567890",
  "alamat": "Jl. Merdeka No. 1",
  "role": "petugas",
  "nip": "198901012020011001",
  "divisi": "Infrastruktur"
}
```

**Response:**
```json
{
  "message": "User berhasil dibuat",
  "data": {
    "id": 2,
    "username": "petugas1",
    "email": "petugas1@crm.com",
    "nama_lengkap": "Petugas Satu",
    "role": "petugas"
  }
}
```

### Update User
```
PUT /api/users/:id
```

**Body:**
```json
{
  "nama_lengkap": "Petugas Satu Updated",
  "email": "petugas1.new@crm.com",
  "no_telepon": "081234567890",
  "alamat": "New Address",
  "role": "petugas",
  "nip": "198901012020011001",
  "divisi": "Kebersihan"
}
```

**Response:**
```json
{
  "message": "User berhasil diupdate",
  "data": {
    "id": 2,
    "username": "petugas1",
    "email": "petugas1.new@crm.com",
    "nama_lengkap": "Petugas Satu Updated",
    "role": "petugas"
  }
}
```

### Change User Password
```
PUT /api/users/:id/password
```

**Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password berhasil diubah"
}
```

### Delete User
```
DELETE /api/users/:id
```

**Response:**
```json
{
  "message": "User berhasil dihapus"
}
```
