import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PengaduanList from './pages/PengaduanList';
import PengaduanForm from './pages/PengaduanForm';
import PengaduanDetail from './pages/PengaduanDetail';
import UserManagement from './pages/UserManagement';
import { authService } from './services';

function PrivateRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pengaduan"
          element={
            <PrivateRoute>
              <PengaduanList />
            </PrivateRoute>
          }
        />
        <Route
          path="/pengaduan/new"
          element={
            <PrivateRoute>
              <PengaduanForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/pengaduan/:id"
          element={
            <PrivateRoute>
              <PengaduanDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
