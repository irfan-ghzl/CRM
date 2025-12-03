const db = require('../config/database');

const createTanggapan = async (req, res) => {
  try {
    const { pengaduan_id, isi_tanggapan } = req.body;
    const petugas_id = req.user.id;

    const result = await db.query(
      `INSERT INTO tanggapan (pengaduan_id, petugas_id, isi_tanggapan)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [pengaduan_id, petugas_id, isi_tanggapan]
    );

    // Update pengaduan status to selesai
    await db.query(
      'UPDATE pengaduan SET status = $1, tanggal_selesai = CURRENT_TIMESTAMP WHERE id = $2',
      ['selesai', pengaduan_id]
    );

    // Get pengaduan user_id for notification
    const pengaduan = await db.query(
      'SELECT user_id, nomor_pengaduan FROM pengaduan WHERE id = $1',
      [pengaduan_id]
    );

    // Create notification
    await db.query(
      `INSERT INTO notifikasi (user_id, judul, pesan, tipe)
       VALUES ($1, 'Pengaduan Selesai', $2, 'tanggapan')`,
      [pengaduan.rows[0].user_id, `Pengaduan ${pengaduan.rows[0].nomor_pengaduan} telah selesai ditangani`]
    );

    res.status(201).json({
      message: 'Tanggapan berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create tanggapan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const getTanggapanByPengaduan = async (req, res) => {
  try {
    const { pengaduan_id } = req.params;

    const result = await db.query(
      `SELECT t.*, u.nama_lengkap as nama_petugas
       FROM tanggapan t
       LEFT JOIN users u ON t.petugas_id = u.id
       WHERE t.pengaduan_id = $1`,
      [pengaduan_id]
    );

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Get tanggapan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

module.exports = { createTanggapan, getTanggapanByPengaduan };
