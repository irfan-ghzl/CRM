const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, username, email, nama_lengkap, no_telepon, alamat, role, 
             nik, nip, divisi, created_at, updated_at
      FROM users
    `;
    const params = [];
    
    if (role) {
      query += ` WHERE role = $1`;
      params.push(role);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users';
    const countParams = [];
    if (role) {
      countQuery += ' WHERE role = $1';
      countParams.push(role);
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
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data user' });
  }
};

// Get petugas list (for assignment)
const getPetugas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, username, nama_lengkap, nip, divisi
      FROM users
      WHERE role = 'petugas'
      ORDER BY nama_lengkap
    `);
    
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Get petugas error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data petugas' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT id, username, email, nama_lengkap, no_telepon, alamat, role,
             nik, nip, divisi, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      nama_lengkap, 
      no_telepon, 
      alamat, 
      role,
      nik,
      nip,
      divisi
    } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !nama_lengkap || !role) {
      return res.status(400).json({ message: 'Username, email, password, nama_lengkap, dan role harus diisi' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Format email tidak valid' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }
    
    // Check for password complexity (at least one uppercase, one lowercase, one number)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({ 
        message: 'Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka' 
      });
    }
    
    // Validate username (alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Username hanya boleh berisi huruf, angka, dan underscore' });
    }
    
    // Validate role
    if (!['masyarakat', 'petugas', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }
    
    // Check if user exists
    const userExists = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await db.query(
      `INSERT INTO users (username, email, password, nama_lengkap, no_telepon, alamat, role, nik, nip, divisi)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, username, email, nama_lengkap, no_telepon, alamat, role, nik, nip, divisi`,
      [username, email, hashedPassword, nama_lengkap, no_telepon, alamat, role, nik, nip, divisi]
    );
    
    res.status(201).json({
      message: 'User berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat user' });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nama_lengkap, 
      email,
      no_telepon, 
      alamat, 
      role,
      nik,
      nip,
      divisi
    } = req.body;
    
    // Validate ID is a positive integer
    const userId = parseInt(id, 10);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ message: 'ID user tidak valid' });
    }
    
    // Validate role if provided
    if (role && !['masyarakat', 'petugas', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid' });
    }
    
    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format email tidak valid' });
      }
      
      // Check if email is already used by another user
      const emailExists = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );
      
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: 'Email sudah digunakan oleh user lain' });
      }
    }
    
    const result = await db.query(
      `UPDATE users 
       SET nama_lengkap = COALESCE($1, nama_lengkap),
           email = COALESCE($2, email),
           no_telepon = COALESCE($3, no_telepon),
           alamat = COALESCE($4, alamat),
           role = COALESCE($5, role),
           nik = COALESCE($6, nik),
           nip = COALESCE($7, nip),
           divisi = COALESCE($8, divisi),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, username, email, nama_lengkap, no_telepon, alamat, role, nik, nip, divisi`,
      [nama_lengkap, email, no_telepon, alamat, role, nik, nip, divisi, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json({
      message: 'User berhasil diupdate',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate user' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a positive integer
    const userId = parseInt(id, 10);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ message: 'ID user tidak valid' });
    }
    
    // Prevent deleting own account
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
    }
    
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus user' });
  }
};

// Change password (admin can change any user's password)
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    // Validate ID is a positive integer
    const userId = parseInt(id, 10);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ message: 'ID user tidak valid' });
    }
    
    // Validate password strength
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }
    
    // Check for password complexity (at least one uppercase, one lowercase, one number)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({ 
        message: 'Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      [hashedPassword, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah password' });
  }
};

module.exports = {
  getUsers,
  getPetugas,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
};
