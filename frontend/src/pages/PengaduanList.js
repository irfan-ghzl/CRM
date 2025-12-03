import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pengaduanService, authService } from '../services';

function PengaduanList() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    loadPengaduan();
  }, [filters]);

  const loadPengaduan = async () => {
    try {
      setLoading(true);
      const data = await pengaduanService.getAll(filters);
      setPengaduan(data.data);
    } catch (err) {
      setError('Gagal memuat data pengaduan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini?')) {
      try {
        await pengaduanService.delete(id);
        loadPengaduan();
      } catch (err) {
        alert('Gagal menghapus pengaduan');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Daftar Pengaduan</h2>
          {user.role === 'masyarakat' && (
            <button className="btn btn-primary" onClick={() => navigate('/pengaduan/new')}>
              Buat Pengaduan Baru
            </button>
          )}
        </div>

        <div className="card">
          <div className="form-group">
            <label>Filter Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>No. Pengaduan</th>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengaduan.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data</td>
                  </tr>
                ) : (
                  pengaduan.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nomor_pengaduan}</td>
                      <td>{item.judul}</td>
                      <td>{item.nama_kategori}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{new Date(item.tanggal_pengaduan).toLocaleDateString('id-ID')}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/pengaduan/${item.id}`)}
                          style={{ marginRight: '5px' }}
                        >
                          Detail
                        </button>
                        {user.role === 'masyarakat' && item.status === 'pending' && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default PengaduanList;
