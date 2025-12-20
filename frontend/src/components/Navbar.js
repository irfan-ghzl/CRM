import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

function Navbar() {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>Pengaduan Masyarakat</h1>
        <div className="navbar-menu">
          <Link to="/">Dashboard</Link>
          <Link to="/pengaduan">Pengaduan</Link>
          {user.role === 'masyarakat' && (
            <Link to="/pengaduan/new">Buat Pengaduan</Link>
          )}
          {/* === ADMIN MENU - COMMENTED OUT ===
          {user.role === 'admin' && (
            <Link to="/users">Kelola User</Link>
          )}
          === END ADMIN MENU === */}
          <span>{user.nama_lengkap} ({user.role})</span>
          <button className="btn btn-danger" onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
