# Diagram UML Sistem Pengaduan Masyarakat (E-Government)

Dokumentasi ini berisi diagram UML untuk Sistem Pengaduan Masyarakat berbasis web menggunakan format Mermaid.

## 1. Use Case Diagram

Diagram use case menggambarkan interaksi antara aktor (pengguna) dengan sistem.

```mermaid
graph TB
    subgraph "Sistem Pengaduan Masyarakat"
        UC1[Registrasi Akun]
        UC2[Login]
        UC3[Buat Pengaduan]
        UC4[Lihat Status Pengaduan]
        UC5[Update Pengaduan]
        UC6[Hapus Pengaduan]
        UC7[Kelola Pengaduan]
        UC8[Tanggapi Pengaduan]
        UC9[Update Status Pengaduan]
        UC10[Buat Laporan]
        UC11[Kelola Pengguna]
        UC12[Kelola Kategori]
    end
    
    Masyarakat((Masyarakat))
    Petugas((Petugas))
    Admin((Admin))
    
    Masyarakat --> UC1
    Masyarakat --> UC2
    Masyarakat --> UC3
    Masyarakat --> UC4
    Masyarakat --> UC5
    Masyarakat --> UC6
    
    Petugas --> UC2
    Petugas --> UC7
    Petugas --> UC8
    Petugas --> UC9
    
    Admin --> UC2
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC7
```

## 2. Activity Diagram

Diagram aktivitas menggambarkan alur proses pengajuan dan penanganan pengaduan.

```mermaid
flowchart TD
    Start([Mulai]) --> Login{User<br/>Login?}
    Login -->|Belum| Register[Registrasi Akun]
    Register --> LoginForm[Form Login]
    Login -->|Sudah| LoginForm
    LoginForm --> Auth{Autentikasi<br/>Berhasil?}
    Auth -->|Tidak| LoginForm
    Auth -->|Ya| Dashboard[Dashboard]
    
    Dashboard --> BuatPengaduan[Buat Pengaduan Baru]
    BuatPengaduan --> IsiForm[Isi Form Pengaduan]
    IsiForm --> UploadBukti[Upload Bukti/Foto]
    UploadBukti --> ValidasiForm{Form<br/>Valid?}
    ValidasiForm -->|Tidak| IsiForm
    ValidasiForm -->|Ya| Submit[Submit Pengaduan]
    
    Submit --> Notif1[Notifikasi ke Masyarakat]
    Submit --> AssignPetugas[Assign ke Petugas]
    
    AssignPetugas --> PetugasReview[Petugas Review Pengaduan]
    PetugasReview --> ValidasiPengaduan{Pengaduan<br/>Valid?}
    ValidasiPengaduan -->|Tidak Valid| TolakPengaduan[Tolak Pengaduan]
    TolakPengaduan --> NotifTolak[Notifikasi Penolakan]
    
    ValidasiPengaduan -->|Valid| ProsesPengaduan[Proses Pengaduan]
    ProsesPengaduan --> UpdateStatus1[Update Status: Diproses]
    UpdateStatus1 --> Notif2[Notifikasi ke Masyarakat]
    
    UpdateStatus1 --> Tindakan[Lakukan Tindakan]
    Tindakan --> UpdateStatus2[Update Status: Selesai]
    UpdateStatus2 --> BuatTanggapan[Buat Tanggapan]
    BuatTanggapan --> Notif3[Notifikasi Selesai]
    
    NotifTolak --> End([Selesai])
    Notif3 --> Feedback{Masyarakat<br/>Puas?}
    Feedback -->|Ya| Rating[Beri Rating]
    Feedback -->|Tidak| BuatPengaduanLanjutan[Buat Pengaduan Lanjutan]
    BuatPengaduanLanjutan --> IsiForm
    Rating --> End
```

## 3. Sequence Diagram

Diagram sequence menggambarkan interaksi antar komponen sistem dalam urutan waktu.

```mermaid
sequenceDiagram
    actor M as Masyarakat
    participant UI as User Interface
    participant Auth as Authentication
    participant API as API Server
    participant DB as Database
    participant Notif as Notification Service
    actor P as Petugas
    
    M->>UI: Akses halaman login
    UI->>M: Tampilkan form login
    M->>UI: Input credentials
    UI->>Auth: Kirim credentials
    Auth->>DB: Validasi user
    DB-->>Auth: Data user
    Auth-->>UI: Token autentikasi
    UI-->>M: Redirect ke dashboard
    
    M->>UI: Klik buat pengaduan
    UI->>M: Tampilkan form pengaduan
    M->>UI: Isi form & upload bukti
    UI->>API: POST /api/complaints
    API->>DB: Simpan pengaduan
    DB-->>API: Complaint ID
    API->>Notif: Kirim notifikasi
    Notif-->>M: Email/SMS konfirmasi
    API->>DB: Assign ke petugas
    DB-->>API: Success
    Notif-->>P: Notifikasi pengaduan baru
    API-->>UI: Response sukses
    UI-->>M: Tampilkan nomor pengaduan
    
    P->>UI: Login sebagai petugas
    UI->>P: Dashboard petugas
    P->>UI: Lihat pengaduan
    UI->>API: GET /api/complaints/{id}
    API->>DB: Query detail pengaduan
    DB-->>API: Data pengaduan
    API-->>UI: Data pengaduan
    UI-->>P: Tampilkan detail
    
    P->>UI: Update status pengaduan
    UI->>API: PUT /api/complaints/{id}/status
    API->>DB: Update status
    DB-->>API: Success
    API->>Notif: Kirim notifikasi update
    Notif-->>M: Notifikasi status update
    API-->>UI: Response sukses
    UI-->>P: Konfirmasi update
    
    P->>UI: Buat tanggapan
    UI->>API: POST /api/complaints/{id}/response
    API->>DB: Simpan tanggapan
    DB-->>API: Response ID
    API->>Notif: Kirim notifikasi
    Notif-->>M: Notifikasi pengaduan selesai
    API-->>UI: Response sukses
    UI-->>P: Konfirmasi tanggapan
```

## 4. Class Diagram

Diagram kelas menggambarkan struktur data dan relasi antar kelas dalam sistem.

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string password
        +string nama_lengkap
        +string no_telepon
        +string alamat
        +string role
        +datetime created_at
        +datetime updated_at
        +login()
        +logout()
        +register()
        +updateProfile()
    }
    
    class Masyarakat {
        +int nik
        +string foto_ktp
        +buatPengaduan()
        +lihatPengaduan()
        +updatePengaduan()
        +hapusPengaduan()
        +beriRating()
    }
    
    class Petugas {
        +string nip
        +string divisi
        +reviewPengaduan()
        +prosesPengaduan()
        +updateStatus()
        +buatTanggapan()
    }
    
    class Admin {
        +kelolaUser()
        +kelolaPengaduan()
        +kelolaKategori()
        +buatLaporan()
        +lihatStatistik()
    }
    
    class Pengaduan {
        +int id
        +int user_id
        +int kategori_id
        +int petugas_id
        +string nomor_pengaduan
        +string judul
        +string isi_pengaduan
        +string lokasi
        +string status
        +int prioritas
        +datetime tanggal_pengaduan
        +datetime tanggal_selesai
        +create()
        +update()
        +delete()
        +assignPetugas()
        +updateStatus()
    }
    
    class Kategori {
        +int id
        +string nama_kategori
        +string deskripsi
        +string icon
        +boolean is_active
        +create()
        +update()
        +delete()
    }
    
    class FileBukti {
        +int id
        +int pengaduan_id
        +string nama_file
        +string path
        +string tipe_file
        +int ukuran
        +datetime uploaded_at
        +upload()
        +delete()
    }
    
    class Tanggapan {
        +int id
        +int pengaduan_id
        +int petugas_id
        +string isi_tanggapan
        +datetime tanggal_tanggapan
        +create()
        +update()
    }
    
    class Rating {
        +int id
        +int pengaduan_id
        +int user_id
        +int nilai
        +string komentar
        +datetime created_at
        +create()
        +update()
    }
    
    class Notifikasi {
        +int id
        +int user_id
        +string judul
        +string pesan
        +string tipe
        +boolean is_read
        +datetime created_at
        +send()
        +markAsRead()
    }
    
    class StatusHistory {
        +int id
        +int pengaduan_id
        +string status_lama
        +string status_baru
        +int changed_by
        +string keterangan
        +datetime changed_at
        +create()
    }
    
    User <|-- Masyarakat
    User <|-- Petugas
    User <|-- Admin
    
    Masyarakat "1" --> "*" Pengaduan : membuat
    Petugas "1" --> "*" Pengaduan : menangani
    Pengaduan "*" --> "1" Kategori : memiliki
    Pengaduan "1" --> "*" FileBukti : memiliki
    Pengaduan "1" --> "0..1" Tanggapan : memiliki
    Pengaduan "1" --> "0..1" Rating : memiliki
    Pengaduan "1" --> "*" StatusHistory : memiliki
    User "1" --> "*" Notifikasi : menerima
    Petugas "1" --> "*" Tanggapan : membuat
```

## Penjelasan Diagram

### Use Case Diagram
Menampilkan tiga aktor utama:
- **Masyarakat**: Dapat mendaftar, login, membuat, melihat, update, dan hapus pengaduan
- **Petugas**: Dapat login, mengelola, menanggapi, dan mengupdate status pengaduan
- **Admin**: Dapat login, membuat laporan, mengelola pengguna dan kategori

### Activity Diagram
Menggambarkan alur lengkap dari:
1. Login/Registrasi
2. Pembuatan pengaduan
3. Validasi dan assignment ke petugas
4. Review dan proses pengaduan
5. Penyelesaian dan feedback

### Sequence Diagram
Menunjukkan interaksi antar komponen:
- User Interface
- Authentication Service
- API Server
- Database
- Notification Service
- Interaksi antara Masyarakat dan Petugas

### Class Diagram
Struktur data sistem meliputi:
- User dan inheritance (Masyarakat, Petugas, Admin)
- Pengaduan sebagai entitas utama
- Supporting entities (Kategori, FileBukti, Tanggapan, Rating, dll)
- Relasi antar kelas dengan kardinalitas
