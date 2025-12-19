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

Diagram aktivitas menggambarkan alur proses untuk setiap role pengguna dalam sistem.

### 2.1 Activity Diagram - Masyarakat

Diagram aktivitas untuk role Masyarakat menggambarkan alur dari registrasi hingga memberikan feedback.

```mermaid
flowchart TD
    Start([Mulai]) --> CheckLogin{Sudah Punya<br/>Akun?}
    CheckLogin -->|Belum| Register[Registrasi Akun]
    Register --> InputRegister[Input Data:<br/>Username, Email, Password<br/>NIK, Nama, Alamat]
    InputRegister --> ValidasiRegister{Data<br/>Valid?}
    ValidasiRegister -->|Tidak| InputRegister
    ValidasiRegister -->|Ya| AccountCreated[Akun Berhasil Dibuat]
    AccountCreated --> LoginPage[Halaman Login]
    
    CheckLogin -->|Sudah| LoginPage
    LoginPage --> InputCredentials[Input Username & Password]
    InputCredentials --> Auth{Autentikasi<br/>Berhasil?}
    Auth -->|Tidak| LoginPage
    Auth -->|Ya| DashboardMasy[Dashboard Masyarakat]
    
    DashboardMasy --> PilihMenu{Pilih Menu}
    PilihMenu -->|Buat Pengaduan| FormPengaduan[Form Pengaduan Baru]
    FormPengaduan --> InputPengaduan[Input:<br/>Judul, Isi, Lokasi<br/>Kategori, Prioritas]
    InputPengaduan --> UploadBukti[Upload Bukti/Foto<br/>Optional]
    UploadBukti --> ValidasiForm{Form<br/>Valid?}
    ValidasiForm -->|Tidak| InputPengaduan
    ValidasiForm -->|Ya| SubmitPengaduan[Submit Pengaduan]
    SubmitPengaduan --> NomorPengaduan[Tampilkan Nomor Pengaduan]
    NomorPengaduan --> NotifSubmit[Terima Notifikasi Konfirmasi]
    NotifSubmit --> DashboardMasy
    
    PilihMenu -->|Lihat Status| ListPengaduan[List Pengaduan Saya]
    ListPengaduan --> DetailPengaduan[Lihat Detail Pengaduan]
    DetailPengaduan --> CheckStatus{Status<br/>Pengaduan?}
    CheckStatus -->|Pending| WaitNotif[Tunggu Notifikasi Update]
    CheckStatus -->|Diproses| ViewProgress[Lihat Progress]
    CheckStatus -->|Selesai| ViewTanggapan[Lihat Tanggapan Petugas]
    ViewTanggapan --> Satisfied{Puas dengan<br/>Tanggapan?}
    Satisfied -->|Ya| BeriRating[Beri Rating & Komentar]
    BeriRating --> End([Selesai])
    Satisfied -->|Tidak| PengaduanBaru[Buat Pengaduan Baru]
    PengaduanBaru --> FormPengaduan
    
    PilihMenu -->|Update Pengaduan| SelectPengaduan[Pilih Pengaduan]
    SelectPengaduan --> CheckStatusEdit{Status<br/>Pending?}
    CheckStatusEdit -->|Ya| EditForm[Edit Form Pengaduan]
    EditForm --> SaveChanges[Simpan Perubahan]
    SaveChanges --> DashboardMasy
    CheckStatusEdit -->|Tidak| CannotEdit[Tidak Bisa Edit<br/>Status Sudah Diproses]
    CannotEdit --> DashboardMasy
    
    PilihMenu -->|Hapus Pengaduan| SelectDelete[Pilih Pengaduan]
    SelectDelete --> ConfirmDelete{Konfirmasi<br/>Hapus?}
    ConfirmDelete -->|Ya| DeletePengaduan[Hapus Pengaduan]
    DeletePengaduan --> DashboardMasy
    ConfirmDelete -->|Tidak| DashboardMasy
    
    PilihMenu -->|Logout| Logout[Logout]
    WaitNotif --> DashboardMasy
    ViewProgress --> DashboardMasy
    Logout --> End
```

### 2.2 Activity Diagram - Petugas

Diagram aktivitas untuk role Petugas menggambarkan alur mengelola dan menanggapi pengaduan.

```mermaid
flowchart TD
    Start([Mulai]) --> LoginPetugas[Halaman Login]
    LoginPetugas --> InputCred[Input Username & Password]
    InputCred --> AuthPetugas{Autentikasi<br/>Berhasil?}
    AuthPetugas -->|Tidak| LoginPetugas
    AuthPetugas -->|Ya| DashboardPetugas[Dashboard Petugas]
    
    DashboardPetugas --> NotifBaru{Ada Notifikasi<br/>Pengaduan Baru?}
    NotifBaru -->|Ya| LihatNotif[Lihat Notifikasi]
    LihatNotif --> DashboardPetugas
    NotifBaru -->|Tidak| PilihMenuPetugas{Pilih Menu}
    
    PilihMenuPetugas -->|Kelola Pengaduan| FilterPengaduan[Filter Pengaduan<br/>Assigned ke Saya]
    FilterPengaduan --> ListPengaduanPetugas[List Pengaduan]
    ListPengaduanPetugas --> PilihPengaduan[Pilih Pengaduan]
    PilihPengaduan --> DetailPengaduanPet[Lihat Detail Lengkap<br/>Judul, Isi, Lokasi, Bukti]
    
    DetailPengaduanPet --> ReviewPengaduan{Pengaduan<br/>Valid?}
    ReviewPengaduan -->|Tidak Valid| TolakPengaduan[Update Status: Ditolak]
    TolakPengaduan --> InputAlasan[Input Alasan Penolakan]
    InputAlasan --> NotifPenolakan[Kirim Notifikasi ke Masyarakat]
    NotifPenolakan --> DashboardPetugas
    
    ReviewPengaduan -->|Valid| TerimaPengaduan[Update Status: Diproses]
    TerimaPengaduan --> NotifDiproses[Notifikasi ke Masyarakat]
    NotifDiproses --> ProsesPengaduan[Lakukan Tindakan<br/>Sesuai Pengaduan]
    ProsesPengaduan --> UpdateProgress{Perlu Update<br/>Progress?}
    UpdateProgress -->|Ya| UpdateStatus[Update Status & Keterangan]
    UpdateStatus --> NotifUpdate[Kirim Notifikasi Update]
    NotifUpdate --> ProsesPengaduan
    
    UpdateProgress -->|Selesai| SelesaiPengaduan[Update Status: Selesai]
    SelesaiPengaduan --> BuatTanggapan[Buat Tanggapan]
    BuatTanggapan --> InputTanggapan[Input Isi Tanggapan<br/>Hasil & Solusi]
    InputTanggapan --> SubmitTanggapan[Submit Tanggapan]
    SubmitTanggapan --> NotifSelesai[Notifikasi Selesai ke Masyarakat]
    NotifSelesai --> DashboardPetugas
    
    PilihMenuPetugas -->|Update Status| SelectPengaduanStatus[Pilih Pengaduan]
    SelectPengaduanStatus --> ChangeStatus[Ubah Status Pengaduan]
    ChangeStatus --> InputKeterangan[Input Keterangan]
    InputKeterangan --> SaveStatus[Simpan Perubahan Status]
    SaveStatus --> NotifStatusChange[Kirim Notifikasi]
    NotifStatusChange --> DashboardPetugas
    
    PilihMenuPetugas -->|Tanggapi Pengaduan| SelectPengaduanTanggapan[Pilih Pengaduan Selesai]
    SelectPengaduanTanggapan --> CheckTanggapan{Sudah Ada<br/>Tanggapan?}
    CheckTanggapan -->|Belum| BuatTanggapan
    CheckTanggapan -->|Sudah| ViewTanggapanExist[Lihat Tanggapan]
    ViewTanggapanExist --> DashboardPetugas
    
    PilihMenuPetugas -->|Logout| LogoutPetugas[Logout]
    LogoutPetugas --> End([Selesai])
```

### 2.3 Activity Diagram - Admin

Diagram aktivitas untuk role Admin menggambarkan alur mengelola sistem, pengguna, dan laporan.

```mermaid
flowchart TD
    Start([Mulai]) --> LoginAdmin[Halaman Login]
    LoginAdmin --> InputCredAdmin[Input Username & Password]
    InputCredAdmin --> AuthAdmin{Autentikasi<br/>Berhasil?}
    AuthAdmin -->|Tidak| LoginAdmin
    AuthAdmin -->|Ya| DashboardAdmin[Dashboard Admin]
    
    DashboardAdmin --> ViewStats[Lihat Statistik<br/>Total Pengaduan, Status, dll]
    ViewStats --> PilihMenuAdmin{Pilih Menu}
    
    PilihMenuAdmin -->|Kelola Pengguna| MenuKelolaUser{Pilih Aksi<br/>User Management}
    MenuKelolaUser -->|List User| FilterUser[Filter User by Role<br/>Masyarakat/Petugas/Admin]
    FilterUser --> ListUsers[Tampilkan List Users]
    ListUsers --> MenuKelolaUser
    
    MenuKelolaUser -->|Tambah User| FormTambahUser[Form User Baru]
    FormTambahUser --> InputUserData[Input Data:<br/>Username, Email, Password<br/>Nama, Role]
    InputUserData --> InputRoleSpecific{Role?}
    InputRoleSpecific -->|Petugas| InputNIPDivisi[Input NIP & Divisi]
    InputRoleSpecific -->|Masyarakat| InputNIK[Input NIK]
    InputRoleSpecific -->|Admin| SkipExtra[Skip Extra Fields]
    InputNIPDivisi --> ValidasiUser{Data<br/>Valid?}
    InputNIK --> ValidasiUser
    SkipExtra --> ValidasiUser
    ValidasiUser -->|Tidak| InputUserData
    ValidasiUser -->|Ya| SaveUser[Simpan User Baru]
    SaveUser --> DashboardAdmin
    
    MenuKelolaUser -->|Edit User| SelectUser[Pilih User]
    SelectUser --> EditFormUser[Form Edit User]
    EditFormUser --> UpdateUserData[Update Data User]
    UpdateUserData --> SaveUpdateUser[Simpan Perubahan]
    SaveUpdateUser --> DashboardAdmin
    
    MenuKelolaUser -->|Hapus User| SelectDeleteUser[Pilih User]
    SelectDeleteUser --> ConfirmDeleteUser{Konfirmasi<br/>Hapus?}
    ConfirmDeleteUser -->|Ya| DeleteUser[Hapus User]
    DeleteUser --> DashboardAdmin
    ConfirmDeleteUser -->|Tidak| DashboardAdmin
    
    PilihMenuAdmin -->|Kelola Kategori| MenuKelolaKategori{Pilih Aksi<br/>Kategori}
    MenuKelolaKategori -->|List Kategori| ListKategori[Tampilkan List Kategori]
    ListKategori --> MenuKelolaKategori
    
    MenuKelolaKategori -->|Tambah Kategori| FormKategori[Form Kategori Baru]
    FormKategori --> InputKategori[Input:<br/>Nama, Deskripsi, Icon]
    InputKategori --> ValidasiKategori{Data<br/>Valid?}
    ValidasiKategori -->|Tidak| InputKategori
    ValidasiKategori -->|Ya| SaveKategori[Simpan Kategori]
    SaveKategori --> DashboardAdmin
    
    MenuKelolaKategori -->|Edit Kategori| SelectKategori[Pilih Kategori]
    SelectKategori --> EditFormKategori[Form Edit Kategori]
    EditFormKategori --> UpdateKategori[Update Data Kategori]
    UpdateKategori --> SaveUpdateKategori[Simpan Perubahan]
    SaveUpdateKategori --> DashboardAdmin
    
    MenuKelolaKategori -->|Hapus Kategori| SelectDeleteKat[Pilih Kategori]
    SelectDeleteKat --> ConfirmDeleteKat{Konfirmasi<br/>Hapus?}
    ConfirmDeleteKat -->|Ya| DeleteKategori[Hapus Kategori]
    DeleteKategori --> DashboardAdmin
    ConfirmDeleteKat -->|Tidak| DashboardAdmin
    
    PilihMenuAdmin -->|Kelola Pengaduan| ViewAllPengaduan[Lihat Semua Pengaduan]
    ViewAllPengaduan --> FilterPengaduanAdmin[Filter by Status/Kategori]
    FilterPengaduanAdmin --> SelectPengaduanAdmin[Pilih Pengaduan]
    SelectPengaduanAdmin --> ActionPengaduan{Pilih Aksi}
    
    ActionPengaduan -->|Assign Petugas| ListPetugas[Tampilkan List Petugas]
    ListPetugas --> SelectPetugas[Pilih Petugas]
    SelectPetugas --> AssignToPetugas[Assign Pengaduan ke Petugas]
    AssignToPetugas --> UpdateStatusProses[Update Status: Diproses]
    UpdateStatusProses --> NotifPetugas[Notifikasi ke Petugas]
    NotifPetugas --> DashboardAdmin
    
    ActionPengaduan -->|Update Status| ChangeStatusAdmin[Ubah Status]
    ChangeStatusAdmin --> DashboardAdmin
    
    ActionPengaduan -->|View Detail| ViewDetailAdmin[Lihat Detail Lengkap]
    ViewDetailAdmin --> DashboardAdmin
    
    PilihMenuAdmin -->|Buat Laporan| SelectPeriode[Pilih Periode Laporan]
    SelectPeriode --> SelectJenisLaporan{Jenis<br/>Laporan?}
    SelectJenisLaporan -->|By Status| LaporanStatus[Generate Laporan Status]
    SelectJenisLaporan -->|By Kategori| LaporanKategori[Generate Laporan Kategori]
    SelectJenisLaporan -->|By Petugas| LaporanPetugas[Generate Laporan Kinerja]
    LaporanStatus --> ExportLaporan[Export PDF/Excel]
    LaporanKategori --> ExportLaporan
    LaporanPetugas --> ExportLaporan
    ExportLaporan --> DashboardAdmin
    
    PilihMenuAdmin -->|Lihat Statistik| ViewStatistikDetail[Statistik Detail<br/>Chart & Grafik]
    ViewStatistikDetail --> DashboardAdmin
    
    PilihMenuAdmin -->|Logout| LogoutAdmin[Logout]
    LogoutAdmin --> End([Selesai])
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
Menggambarkan alur aktivitas spesifik untuk setiap role pengguna:

#### Activity Diagram - Masyarakat:
1. Registrasi dan Login
2. Pembuatan pengaduan baru dengan upload bukti
3. Melihat status dan detail pengaduan
4. Update dan hapus pengaduan (jika status pending)
5. Memberikan rating untuk pengaduan selesai

#### Activity Diagram - Petugas:
1. Login dan melihat notifikasi pengaduan baru
2. Review dan validasi pengaduan
3. Update status pengaduan (pending, diproses, selesai, ditolak)
4. Membuat tanggapan untuk pengaduan selesai
5. Mengelola pengaduan yang di-assign

#### Activity Diagram - Admin:
1. Login dan melihat statistik sistem
2. Mengelola pengguna (CRUD untuk Masyarakat, Petugas, Admin)
3. Mengelola kategori pengaduan (CRUD)
4. Mengelola dan assign pengaduan ke petugas
5. Membuat laporan (by status, kategori, kinerja petugas)
6. Melihat statistik detail dengan chart dan grafik

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
