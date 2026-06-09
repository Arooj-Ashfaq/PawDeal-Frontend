const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminAPI = {
  // Dashboard
  getReports: async (token: string, period: string = '30d') => {
    const response = await fetch(`${API_URL}/admin/reports?period=${period}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  // User Management
  getUsers: async (token: string, params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateUserStatus: async (token: string, userId: string, status: string) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  // Content Moderation
  getReportedContent: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/moderation/reported`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  moderateContent: async (token: string, type: string, id: string, action: string) => {
    const response = await fetch(`${API_URL}/admin/moderation/${type}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    });
    return response.json();
  },

  // Settings
  getSettings: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateSettings: async (token: string, settings: any) => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    return response.json();
  },

  // Export
  exportData: async (token: string, type: string, format: string = 'csv') => {
    window.open(`${API_URL}/admin/export?type=${type}&format=${format}`, '_blank');
  },

  // System
  getSystemHealth: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/system/health`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  clearCache: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/system/clear-cache`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};