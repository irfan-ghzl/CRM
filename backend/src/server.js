const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pengaduanRoutes = require('./routes/pengaduanRoutes');
const tanggapanRoutes = require('./routes/tanggapanRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const notifikasiRoutes = require('./routes/notifikasiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/tanggapan', tanggapanRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/notifikasi', notifikasiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
