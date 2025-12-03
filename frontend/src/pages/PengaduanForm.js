import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pengaduanService, kategoriService } from '../services';

function PengaduanForm() {
  const [formData, setFormData] = useState({
    judul: '',
    isi_pengaduan: '',
    lokasi: '',
    kategori_id: '',
    prioritas: '2'
  });
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      const data = await kategoriService.getAll();
      setKategori(data.data);
    } catch (err) {
      setError('Gagal memuat kategori');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await pengaduanService.create(formData);
      alert('Pengaduan berhasil dibuat');
      navigate('/pengaduan');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Buat Pengaduan Baru</h2>

        {error && <div className="error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Pengaduan *</label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Masukkan judul pengaduan"
              />
            </div>

            <div className="form-group">
              <label>Kategori *</label>
              <select
                name="kategori_id"
                value={formData.kategori_id}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Pilih Kategori</option>
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Isi Pengaduan *</label>
              <textarea
                name="isi_pengaduan"
                value={formData.isi_pengaduan}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Jelaskan pengaduan Anda secara detail"
                rows="6"
              />
            </div>

            <div className="form-group">
              <label>Lokasi</label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                disabled={loading}
                placeholder="Lokasi kejadian"
              />
            </div>

            <div className="form-group">
              <label>Prioritas</label>
              <select
                name="prioritas"
                value={formData.prioritas}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="1">Tinggi</option>
                <option value="2">Sedang</option>
                <option value="3">Rendah</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Kirim Pengaduan'}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/pengaduan')}
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PengaduanForm;
