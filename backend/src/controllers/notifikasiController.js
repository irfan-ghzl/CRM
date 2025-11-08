const db = require('../config/database');

const getNotifikasi = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT * FROM notifikasi
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) FROM notifikasi WHERE user_id = $1',
      [user_id]
    );

    const unreadResult = await db.query(
      'SELECT COUNT(*) FROM notifikasi WHERE user_id = $1 AND is_read = false',
      [user_id]
    );

    res.json({
      data: result.rows,
      unread: parseInt(unreadResult.rows[0].count),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Get notifikasi error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await db.query(
      'UPDATE notifikasi SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    res.json({ message: 'Notifikasi ditandai sebagai dibaca' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.query(
      'UPDATE notifikasi SET is_read = true WHERE user_id = $1',
      [user_id]
    );

    res.json({ message: 'Semua notifikasi ditandai sebagai dibaca' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

module.exports = { getNotifikasi, markAsRead, markAllAsRead };
