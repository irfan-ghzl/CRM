const db = require('../config/database');

const getKategori = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM kategori WHERE is_active = true ORDER BY nama_kategori'
    );

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Get kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi, icon } = req.body;

    const result = await db.query(
      `INSERT INTO kategori (nama_kategori, deskripsi, icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nama_kategori, deskripsi, icon]
    );

    res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori, deskripsi, icon, is_active } = req.body;

    const result = await db.query(
      `UPDATE kategori
       SET nama_kategori = $1, deskripsi = $2, icon = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [nama_kategori, deskripsi, icon, is_active, id]
    );

    res.json({
      message: 'Kategori berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM kategori WHERE id = $1', [id]);

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Delete kategori error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

module.exports = { getKategori, createKategori, updateKategori, deleteKategori };
