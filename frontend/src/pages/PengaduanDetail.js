import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pengaduanService, tanggapanService, authService } from '../services';

function PengaduanDetail() {
  const { id } = useParams();
  const [pengaduan, setPengaduan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tanggapan, setTanggapan] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    loadPengaduan();
  }, [id]);

  const loadPengaduan = async () => {
    try {
      setLoading(true);
      const data = await pengaduanService.getById(id);
      setPengaduan(data.data);
      setNewStatus(data.data.status);
    } catch (err) {
      setError('Gagal memuat detail pengaduan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await pengaduanService.updateStatus(id, newStatus, keterangan);
      alert('Status berhasil diupdate');
      loadPengaduan();
      setKeterangan('');
    } catch (err) {
      alert('Gagal mengupdate status');
    }
  };

  const handleCreateTanggapan = async (e) => {
    e.preventDefault();
    try {
      await tanggapanService.create({
        pengaduan_id: id,
        isi_tanggapan: tanggapan
      });
      alert('Tanggapan berhasil dibuat');
      loadPengaduan();
      setTanggapan('');
    } catch (err) {
      alert('Gagal membuat tanggapan');
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

  if (error || !pengaduan) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error">{error || 'Pengaduan tidak ditemukan'}</div>
          <button className="btn btn-primary" onClick={() => navigate('/pengaduan')}>
            Kembali
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <button className="btn" onClick={() => navigate('/pengaduan')} style={{ marginBottom: '20px' }}>
          ← Kembali
        </button>

        <div className="card">
          <h2>{pengaduan.judul}</h2>
          <div style={{ marginBottom: '20px' }}>
            <span className={`status-badge status-${pengaduan.status}`}>
              {pengaduan.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <p><strong>No. Pengaduan:</strong> {pengaduan.nomor_pengaduan}</p>
              <p><strong>Kategori:</strong> {pengaduan.nama_kategori}</p>
              <p><strong>Pelapor:</strong> {pengaduan.nama_pelapor}</p>
            </div>
            <div>
              <p><strong>Tanggal:</strong> {new Date(pengaduan.tanggal_pengaduan).toLocaleString('id-ID')}</p>
              <p><strong>Lokasi:</strong> {pengaduan.lokasi || '-'}</p>
              {pengaduan.nama_petugas && <p><strong>Petugas:</strong> {pengaduan.nama_petugas}</p>}
            </div>
          </div>

          <div>
            <h3>Isi Pengaduan</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{pengaduan.isi_pengaduan}</p>
          </div>
        </div>

        {pengaduan.tanggapan && (
          <div className="card">
            <h3>Tanggapan Petugas</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{pengaduan.tanggapan.isi_tanggapan}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              {pengaduan.tanggapan.nama_petugas} - {new Date(pengaduan.tanggapan.tanggal_tanggapan).toLocaleString('id-ID')}
            </p>
          </div>
        )}

        {pengaduan.history && pengaduan.history.length > 0 && (
          <div className="card">
            <h3>Riwayat Status</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Status Lama</th>
                  <th>Status Baru</th>
                  <th>Diubah Oleh</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {pengaduan.history.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.changed_at).toLocaleString('id-ID')}</td>
                    <td>{h.status_lama || '-'}</td>
                    <td>
                      <span className={`status-badge status-${h.status_baru}`}>
                        {h.status_baru}
                      </span>
                    </td>
                    <td>{h.changed_by_name}</td>
                    <td>{h.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(user.role === 'admin' || user.role === 'petugas') && (
          <>
            <div className="card">
              <h3>Update Status</h3>
              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label>Status Baru</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Keterangan</label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Keterangan perubahan status (opsional)"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Status
                </button>
              </form>
            </div>

            {!pengaduan.tanggapan && (
              <div className="card">
                <h3>Buat Tanggapan</h3>
                <form onSubmit={handleCreateTanggapan}>
                  <div className="form-group">
                    <label>Isi Tanggapan</label>
                    <textarea
                      value={tanggapan}
                      onChange={(e) => setTanggapan(e.target.value)}
                      required
                      placeholder="Tulis tanggapan untuk pengaduan ini"
                      rows="4"
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Kirim Tanggapan
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default PengaduanDetail;
