const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export async function request(path, options = {}) {
  const token = localStorage.getItem('janpehchaan_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${path}]:`, error);
    throw error;
  }
}

export const ApiService = {
  // Auth
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      localStorage.setItem('janpehchaan_token', res.token);
      localStorage.setItem('janpehchaan_user', JSON.stringify(res.user));
    }
    return res;
  },

  async register(name, email, password, phone) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
  },

  async resetPassword(email, newPassword) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    });
  },

  async getMe() {
    return request('/auth/me');
  },

  logout() {
    localStorage.removeItem('janpehchaan_token');
    localStorage.removeItem('janpehchaan_user');
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('janpehchaan_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Dashboard & Metrics
  async getDashboardStats() {
    return request('/dashboard');
  },

  // Families & Members
  async getFamilies(search = '') {
    return request(`/families${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async getFamilyById(id) {
    return request(`/families/${id}`);
  },

  async createFamily(familyData) {
    return request('/families', {
      method: 'POST',
      body: JSON.stringify(familyData)
    });
  },

  // Verification & Duplicate Checks
  async verifyFamilyRecord(familyId) {
    return request(`/verification/check/${familyId}`, {
      method: 'POST'
    });
  },

  // Schemes & Matching
  async getSchemes() {
    return request('/schemes');
  },

  async evaluateEligibility(familyId) {
    return request(`/schemes/evaluate/${familyId}`, {
      method: 'POST'
    });
  },

  // Applications
  async getApplications() {
    return request('/applications');
  },

  async submitApplication(data) {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async reviewApplication(id, status, notes) {
    return request(`/applications/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  // Review & Audits
  async getDuplicateQueue() {
    return request('/duplicate-queue');
  },

  async getAuditLogs() {
    return request('/audit-logs');
  }
};
