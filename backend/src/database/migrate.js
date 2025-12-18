const db = require('../config/database');

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama_lengkap VARCHAR(255) NOT NULL,
        no_telepon VARCHAR(20),
        alamat TEXT,
        role VARCHAR(20) NOT NULL CHECK (role IN ('masyarakat', 'petugas', 'admin')),
        nik VARCHAR(20),
        nip VARCHAR(20),
        divisi VARCHAR(100),
        foto_ktp VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Kategori table
    await db.query(`
      CREATE TABLE IF NOT EXISTS kategori (
        id SERIAL PRIMARY KEY,
        nama_kategori VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        icon VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pengaduan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pengaduan (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        kategori_id INTEGER REFERENCES kategori(id),
        petugas_id INTEGER REFERENCES users(id),
        nomor_pengaduan VARCHAR(50) UNIQUE NOT NULL,
        judul VARCHAR(255) NOT NULL,
        isi_pengaduan TEXT NOT NULL,
        lokasi VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')),
        prioritas INTEGER DEFAULT 2 CHECK (prioritas BETWEEN 1 AND 3),
        tanggal_pengaduan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_selesai TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // File Bukti table
    await db.query(`
      CREATE TABLE IF NOT EXISTS file_bukti (
        id SERIAL PRIMARY KEY,
        pengaduan_id INTEGER NOT NULL REFERENCES pengaduan(id) ON DELETE CASCADE,
        nama_file VARCHAR(255) NOT NULL,
        path VARCHAR(500) NOT NULL,
        tipe_file VARCHAR(50),
        ukuran INTEGER,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tanggapan table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tanggapan (
        id SERIAL PRIMARY KEY,
        pengaduan_id INTEGER NOT NULL REFERENCES pengaduan(id) ON DELETE CASCADE,
        petugas_id INTEGER NOT NULL REFERENCES users(id),
        isi_tanggapan TEXT NOT NULL,
        tanggal_tanggapan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Rating table
    await db.query(`
      CREATE TABLE IF NOT EXISTS rating (
        id SERIAL PRIMARY KEY,
        pengaduan_id INTEGER NOT NULL REFERENCES pengaduan(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        nilai INTEGER NOT NULL CHECK (nilai BETWEEN 1 AND 5),
        komentar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifikasi table
    await db.query(`
      CREATE TABLE IF NOT EXISTS notifikasi (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        judul VARCHAR(255) NOT NULL,
        pesan TEXT NOT NULL,
        tipe VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Status History table
    await db.query(`
      CREATE TABLE IF NOT EXISTS status_history (
        id SERIAL PRIMARY KEY,
        pengaduan_id INTEGER NOT NULL REFERENCES pengaduan(id) ON DELETE CASCADE,
        status_lama VARCHAR(20),
        status_baru VARCHAR(20) NOT NULL,
        changed_by INTEGER NOT NULL REFERENCES users(id),
        keterangan TEXT,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await db.query('CREATE INDEX IF NOT EXISTS idx_pengaduan_user ON pengaduan(user_id);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_pengaduan_status ON pengaduan(status);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_notifikasi_user ON notifikasi(user_id);');

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    // Check if admin exists
    const adminCheck = await db.query("SELECT id FROM users WHERE username = 'admin'");
    
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
      const hashedPasswordPetugas = await bcrypt.hash('Petugas123', 10);
      
      // Seed admin account
      await db.query(`
        INSERT INTO users (username, email, password, nama_lengkap, role)
        VALUES ('admin', 'admin@crm.com', $1, 'Administrator', 'admin')
      `, [hashedPasswordAdmin]);

      // Seed petugas accounts for testing
      await db.query(`
        INSERT INTO users (username, email, password, nama_lengkap, no_telepon, alamat, role, nip, divisi) VALUES
        ('petugas1', 'petugas1@crm.com', $1, 'Petugas Infrastruktur', '081234567890', 'Jl. Merdeka No. 10', 'petugas', '198901012020011001', 'Infrastruktur'),
        ('petugas2', 'petugas2@crm.com', $1, 'Petugas Kebersihan', '081234567891', 'Jl. Merdeka No. 11', 'petugas', '198902022020022002', 'Kebersihan')
      `, [hashedPasswordPetugas]);

      // Seed some categories
      await db.query(`
        INSERT INTO kategori (nama_kategori, deskripsi, icon) VALUES
        ('Infrastruktur', 'Pengaduan terkait jalan, jembatan, dan fasilitas publik', 'build'),
        ('Kebersihan', 'Pengaduan terkait kebersihan lingkungan', 'delete'),
        ('Keamanan', 'Pengaduan terkait keamanan dan ketertiban', 'security'),
        ('Pelayanan Publik', 'Pengaduan terkait pelayanan administrasi', 'people'),
        ('Lainnya', 'Pengaduan kategori lainnya', 'more_horiz')
      `);

      console.log('Seed data inserted successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const migrate = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  migrate();
}

module.exports = { createTables, seedData };
