import React, { useState, useEffect } from 'react';
import { userService } from '../services';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    no_telepon: '',
    alamat: '',
    role: 'masyarakat',
    nik: '',
    nip: '',
    divisi: ''
  });
  const [filterRole, setFilterRole] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = filterRole ? { role: filterRole } : {};
      const response = await userService.getAll(params);
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        nama_lengkap: user.nama_lengkap,
        no_telepon: user.no_telepon || '',
        alamat: user.alamat || '',
        role: user.role,
        nik: user.nik || '',
        nip: user.nip || '',
        divisi: user.divisi || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        nama_lengkap: '',
        no_telepon: '',
        alamat: '',
        role: 'masyarakat',
        nik: '',
        nip: '',
        divisi: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError('');
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

    try {
      if (editingUser) {
        // Update user - exclude username and password if empty
        const { username, password, ...updateData } = formData;
        if (password) {
          updateData.password = password;
        }
        await userService.update(editingUser.id, updateData);
      } else {
        // Create user
        if (!formData.password) {
          setError('Password harus diisi untuk user baru');
          return;
        }
        await userService.create(formData);
      }
      
      handleCloseModal();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.delete(deleteUserId);
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menghapus user');
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteUserId(null);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'Admin', color: '#dc3545' },
      petugas: { label: 'Petugas', color: '#007bff' },
      masyarakat: { label: 'Masyarakat', color: '#28a745' }
    };
    const badge = badges[role] || badges.masyarakat;
    return (
      <span style={{ 
        backgroundColor: badge.color, 
        color: 'white', 
        padding: '4px 8px', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Kelola Pengguna</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          Tambah User Baru
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter Role:</label>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">Semua</option>
          <option value="masyarakat">Masyarakat</option>
          <option value="petugas">Petugas</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nama Lengkap</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>NIP/NIK</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{user.username}</td>
                    <td style={{ padding: '12px' }}>{user.nama_lengkap}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{getRoleBadge(user.role)}</td>
                    <td style={{ padding: '12px' }}>
                      {user.nip || user.nik || '-'}
                      {user.divisi && <div style={{ fontSize: '12px', color: '#666' }}>Divisi: {user.divisi}</div>}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleOpenModal(user)} 
                        className="btn btn-primary"
                        style={{ marginRight: '5px', padding: '6px 12px', fontSize: '14px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user.id)} 
                        className="btn"
                        style={{ 
                          backgroundColor: '#dc3545', 
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '14px'
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3>{editingUser ? 'Edit User' : 'Tambah User Baru'}</h3>
            
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={editingUser !== null}
                />
                {editingUser && <small style={{ color: '#666' }}>Username tidak dapat diubah</small>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {editingUser ? '(Kosongkan jika tidak ingin mengubah)' : '*'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="masyarakat">Masyarakat</option>
                  <option value="petugas">Petugas</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === 'masyarakat' && (
                <div className="form-group">
                  <label>NIK</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                  />
                </div>
              )}

              {formData.role === 'petugas' && (
                <>
                  <div className="form-group">
                    <label>NIP</label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Divisi</label>
                    <input
                      type="text"
                      name="divisi"
                      value={formData.divisi}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>No. Telepon</label>
                <input
                  type="text"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Alamat</label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingUser ? 'Update' : 'Tambah'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="btn"
                  style={{ flex: 1, backgroundColor: '#6c757d', color: 'white' }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3>Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus user ini?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleDeleteConfirm}
                className="btn"
                style={{ flex: 1, backgroundColor: '#dc3545', color: 'white' }}
              >
                Hapus
              </button>
              <button 
                onClick={handleDeleteCancel}
                className="btn"
                style={{ flex: 1, backgroundColor: '#6c757d', color: 'white' }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
