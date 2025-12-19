import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

export const pengaduanService = {
  getAll: async (params) => {
    const response = await api.get('/pengaduan', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pengaduan/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/pengaduan', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/pengaduan/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pengaduan/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, keterangan) => {
    const response = await api.put(`/pengaduan/${id}/status`, { status, keterangan });
    return response.data;
  },

  assignPetugas: async (id, petugas_id) => {
    const response = await api.put(`/pengaduan/${id}/assign`, { petugas_id });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/pengaduan/statistics');
    return response.data;
  },
};

export const kategoriService = {
  getAll: async () => {
    const response = await api.get('/kategori');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/kategori', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/kategori/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/kategori/${id}`);
    return response.data;
  },
};

export const tanggapanService = {
  create: async (data) => {
    const response = await api.post('/tanggapan', data);
    return response.data;
  },

  getByPengaduan: async (pengaduan_id) => {
    const response = await api.get(`/tanggapan/pengaduan/${pengaduan_id}`);
    return response.data;
  },
};

export const notifikasiService = {
  getAll: async (params) => {
    const response = await api.get('/notifikasi', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifikasi/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifikasi/read-all');
    return response.data;
  },
};

export const userService = {
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getPetugas: async () => {
    const response = await api.get('/users/petugas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  changePassword: async (id, password) => {
    const response = await api.put(`/users/${id}/password`, { password });
    return response.data;
  },
};

