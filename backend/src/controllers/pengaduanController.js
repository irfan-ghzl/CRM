const db = require('../config/database');

const generateNomorPengaduan = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ADU-${year}${month}-${random}`;
};

const createPengaduan = async (req, res) => {
  try {
    const { kategori_id, judul, isi_pengaduan, lokasi, prioritas } = req.body;
    const user_id = req.user.id;
    const nomor_pengaduan = generateNomorPengaduan();

    const result = await db.query(
      `INSERT INTO pengaduan (user_id, kategori_id, nomor_pengaduan, judul, isi_pengaduan, lokasi, prioritas, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [user_id, kategori_id, nomor_pengaduan, judul, isi_pengaduan, lokasi, prioritas || 2]
    );

    // Create notification for admin/petugas
    await db.query(
      `INSERT INTO notifikasi (user_id, judul, pesan, tipe)
       SELECT id, 'Pengaduan Baru', $1, 'pengaduan_baru'
       FROM users WHERE role IN ('admin', 'petugas')`,
      [`Pengaduan baru: ${judul} (${nomor_pengaduan})`]
    );

    res.status(201).json({
      message: 'Pengaduan berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const getPengaduan = async (req, res) => {
  try {
    const { status, kategori_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const user_id = req.user.id;
    const role = req.user.role;

    let query = `
      SELECT p.*, k.nama_kategori, u.nama_lengkap as nama_pelapor,
             pt.nama_lengkap as nama_petugas
      FROM pengaduan p
      LEFT JOIN kategori k ON p.kategori_id = k.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN users pt ON p.petugas_id = pt.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by role
    if (role === 'masyarakat') {
      query += ` AND p.user_id = $${paramIndex}`;
      params.push(user_id);
      paramIndex++;
    } else if (role === 'petugas') {
      query += ` AND (p.petugas_id = $${paramIndex} OR p.petugas_id IS NULL)`;
      params.push(user_id);
      paramIndex++;
    }

    // Filter by status
    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filter by kategori
    if (kategori_id) {
      query += ` AND p.kategori_id = $${paramIndex}`;
      params.push(kategori_id);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM pengaduan p WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (role === 'masyarakat') {
      countQuery += ` AND p.user_id = $${countParamIndex}`;
      countParams.push(user_id);
      countParamIndex++;
    } else if (role === 'petugas') {
      countQuery += ` AND (p.petugas_id = $${countParamIndex} OR p.petugas_id IS NULL)`;
      countParams.push(user_id);
      countParamIndex++;
    }

    if (status) {
      countQuery += ` AND p.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (kategori_id) {
      countQuery += ` AND p.kategori_id = $${countParamIndex}`;
      countParams.push(kategori_id);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT p.*, k.nama_kategori, u.nama_lengkap as nama_pelapor,
              u.email as email_pelapor, u.no_telepon as telepon_pelapor,
              pt.nama_lengkap as nama_petugas
       FROM pengaduan p
       LEFT JOIN kategori k ON p.kategori_id = k.id
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN users pt ON p.petugas_id = pt.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
    }

    // Get file bukti
    const files = await db.query(
      'SELECT * FROM file_bukti WHERE pengaduan_id = $1',
      [id]
    );

    // Get tanggapan
    const tanggapan = await db.query(
      `SELECT t.*, u.nama_lengkap as nama_petugas
       FROM tanggapan t
       LEFT JOIN users u ON t.petugas_id = u.id
       WHERE t.pengaduan_id = $1`,
      [id]
    );

    // Get rating
    const rating = await db.query(
      'SELECT * FROM rating WHERE pengaduan_id = $1',
      [id]
    );

    // Get status history
    const history = await db.query(
      `SELECT sh.*, u.nama_lengkap as changed_by_name
       FROM status_history sh
       LEFT JOIN users u ON sh.changed_by = u.id
       WHERE sh.pengaduan_id = $1
       ORDER BY sh.changed_at DESC`,
      [id]
    );

    res.json({
      data: {
        ...result.rows[0],
        file_bukti: files.rows,
        tanggapan: tanggapan.rows[0] || null,
        rating: rating.rows[0] || null,
        history: history.rows
      }
    });
  } catch (error) {
    console.error('Get pengaduan by id error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi_pengaduan, lokasi, kategori_id } = req.body;
    const user_id = req.user.id;
    const role = req.user.role;

    // Check ownership for masyarakat
    if (role === 'masyarakat') {
      const check = await db.query(
        'SELECT user_id FROM pengaduan WHERE id = $1',
        [id]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
      }

      if (check.rows[0].user_id !== user_id) {
        return res.status(403).json({ message: 'Tidak memiliki akses' });
      }
    }

    const result = await db.query(
      `UPDATE pengaduan
       SET judul = $1, isi_pengaduan = $2, lokasi = $3, kategori_id = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [judul, isi_pengaduan, lokasi, kategori_id, id]
    );

    res.json({
      message: 'Pengaduan berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const role = req.user.role;

    // Check ownership for masyarakat
    if (role === 'masyarakat') {
      const check = await db.query(
        'SELECT user_id FROM pengaduan WHERE id = $1',
        [id]
      );

      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
      }

      if (check.rows[0].user_id !== user_id) {
        return res.status(403).json({ message: 'Tidak memiliki akses' });
      }
    }

    await db.query('DELETE FROM pengaduan WHERE id = $1', [id]);

    res.json({ message: 'Pengaduan berhasil dihapus' });
  } catch (error) {
    console.error('Delete pengaduan error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, keterangan } = req.body;
    const user_id = req.user.id;

    // Get current status
    const current = await db.query(
      'SELECT status, user_id FROM pengaduan WHERE id = $1',
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
    }

    const status_lama = current.rows[0].status;

    // Update status
    await db.query(
      `UPDATE pengaduan SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [status, id]
    );

    // If status is selesai, update tanggal_selesai
    if (status === 'selesai') {
      await db.query(
        'UPDATE pengaduan SET tanggal_selesai = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    }

    // Add to status history
    await db.query(
      `INSERT INTO status_history (pengaduan_id, status_lama, status_baru, changed_by, keterangan)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, status_lama, status, user_id, keterangan]
    );

    // Create notification for user
    const pengaduan = await db.query(
      'SELECT nomor_pengaduan, judul FROM pengaduan WHERE id = $1',
      [id]
    );

    await db.query(
      `INSERT INTO notifikasi (user_id, judul, pesan, tipe)
       VALUES ($1, 'Update Status Pengaduan', $2, 'status_update')`,
      [current.rows[0].user_id, `Status pengaduan ${pengaduan.rows[0].nomor_pengaduan} diubah menjadi ${status}`]
    );

    res.json({ message: 'Status berhasil diupdate' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const assignPetugas = async (req, res) => {
  try {
    const { id } = req.params;
    const { petugas_id } = req.body;

    await db.query(
      'UPDATE pengaduan SET petugas_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [petugas_id, 'diproses', id]
    );

    // Create notification for petugas
    const pengaduan = await db.query(
      'SELECT nomor_pengaduan, judul FROM pengaduan WHERE id = $1',
      [id]
    );

    await db.query(
      `INSERT INTO notifikasi (user_id, judul, pesan, tipe)
       VALUES ($1, 'Pengaduan Ditugaskan', $2, 'assignment')`,
      [petugas_id, `Anda ditugaskan untuk menangani pengaduan: ${pengaduan.rows[0].judul} (${pengaduan.rows[0].nomor_pengaduan})`]
    );

    res.json({ message: 'Petugas berhasil ditugaskan' });
  } catch (error) {
    console.error('Assign petugas error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const getStatistics = async (req, res) => {
  try {
    // Total pengaduan
    const totalPengaduan = await db.query('SELECT COUNT(*) as total FROM pengaduan');
    
    // Pengaduan by status
    const byStatus = await db.query(`
      SELECT status, COUNT(*) as count
      FROM pengaduan
      GROUP BY status
    `);

    // Pengaduan by kategori
    const byKategori = await db.query(`
      SELECT k.nama_kategori, COUNT(p.id) as count
      FROM kategori k
      LEFT JOIN pengaduan p ON k.id = p.kategori_id
      GROUP BY k.nama_kategori
    `);

    // Recent pengaduan
    const recentPengaduan = await db.query(`
      SELECT p.*, k.nama_kategori, u.nama_lengkap
      FROM pengaduan p
      LEFT JOIN kategori k ON p.kategori_id = k.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    res.json({
      total: parseInt(totalPengaduan.rows[0].total),
      byStatus: byStatus.rows,
      byKategori: byKategori.rows,
      recent: recentPengaduan.rows
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

module.exports = {
  createPengaduan,
  getPengaduan,
  getPengaduanById,
  updatePengaduan,
  deletePengaduan,
  updateStatus,
  assignPetugas,
  getStatistics
};
