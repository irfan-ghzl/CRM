const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const register = async (req, res) => {
  try {
    const { username, email, password, nama_lengkap, no_telepon, alamat, nik } = req.body;

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
      `INSERT INTO users (username, email, password, nama_lengkap, no_telepon, alamat, role, nik)
       VALUES ($1, $2, $3, $4, $5, $6, 'masyarakat', $7)
       RETURNING id, username, email, nama_lengkap, role`,
      [username, email, hashedPassword, nama_lengkap, no_telepon, alamat, nik]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login berhasil',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, nama_lengkap, no_telepon, alamat, role, nik, nip, divisi, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nama_lengkap, no_telepon, alamat } = req.body;

    const result = await db.query(
      `UPDATE users SET nama_lengkap = $1, no_telepon = $2, alamat = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, username, email, nama_lengkap, no_telepon, alamat, role`,
      [nama_lengkap, no_telepon, alamat, req.user.id]
    );

    res.json({
      message: 'Profile berhasil diupdate',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
