import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pengaduanService, authService } from '../services';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      if (user.role === 'admin' || user.role === 'petugas') {
        const data = await pengaduanService.getStatistics();
        setStatistics(data);
      }
    } catch (err) {
      setError('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Memuat data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Dashboard</h2>
        <p>Selamat datang, {user.nama_lengkap}!</p>

        {error && <div className="error">{error}</div>}

        {statistics && (
          <>
            <div className="grid">
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h3>Total Pengaduan</h3>
                <p className="value">{statistics.total}</p>
              </div>
              
              {statistics.byStatus.map((stat) => (
                <div key={stat.status} className="stat-card" style={{ 
                  background: stat.status === 'selesai' 
                    ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                    : stat.status === 'diproses'
                    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                }}>
                  <h3>{stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}</h3>
                  <p className="value">{stat.count}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>Pengaduan Terbaru</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>No. Pengaduan</th>
                    <th>Judul</th>
                    <th>Pelapor</th>
                    <th>Kategori</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.recent.map((pengaduan) => (
                    <tr key={pengaduan.id} onClick={() => navigate(`/pengaduan/${pengaduan.id}`)} style={{ cursor: 'pointer' }}>
                      <td>{pengaduan.nomor_pengaduan}</td>
                      <td>{pengaduan.judul}</td>
                      <td>{pengaduan.nama_lengkap}</td>
                      <td>{pengaduan.nama_kategori}</td>
                      <td>
                        <span className={`status-badge status-${pengaduan.status}`}>
                          {pengaduan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {user.role === 'masyarakat' && (
          <div className="card">
            <h3>Selamat Datang di Sistem Pengaduan Masyarakat</h3>
            <p>Gunakan menu di atas untuk membuat pengaduan baru atau melihat pengaduan Anda.</p>
            <button className="btn btn-primary" onClick={() => navigate('/pengaduan/new')}>
              Buat Pengaduan Baru
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
