const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'buyer' | 'seller' | 'both';
  };
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
}

// Auth endpoints
export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('Sending login request with:', { email, password });
    return apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: any): Promise<AuthResponse> => {
    console.log('Sending register request with:', userData);
    return apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Pets endpoints
export const pets = {
  getAll: () => apiCall('/pets'),
  getById: (id: string) => apiCall(`/pets/${id}`),
  create: async (petData: any, token: string) => {
    return apiCall('/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  update: async (id: string, petData: any, token: string) => {
    return apiCall(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  delete: async (id: string, token: string) => {
    return apiCall(`/pets/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Products endpoints
export const products = {
  getAll: () => apiCall('/products'),
  getById: (id: string) => apiCall(`/products/${id}`),
  create: async (productData: any, token: string) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  update: async (id: string, productData: any, token: string) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  delete: async (id: string, token: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Dashboard endpoints
export const dashboard = {
  getStats: async (token: string) => {
    return apiCall('/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getAnalytics: async (token: string, period: string = 'weekly') => {
    return apiCall(`/dashboard/analytics?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getRecentOrders: async (token: string, limit: number = 10) => {
    return apiCall(`/dashboard/orders?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getMyListings: async (token: string) => {
    return apiCall('/dashboard/listings', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getMessages: async (token: string) => {
    return apiCall('/dashboard/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  exportData: async (token: string, type: string) => {
    return apiCall(`/dashboard/export?type=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Message endpoints
export const messages = {
  getConversations: async (token: string, page: number = 1) => {
    return apiCall(`/messages/conversations?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getConversation: async (token: string, conversationId: string, page: number = 1) => {
    return apiCall(`/messages/conversations/${conversationId}?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  sendMessage: async (token: string, conversationId: string, content: string) => {
    return apiCall(`/messages/conversations/${conversationId}/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
  },
  
  createConversation: async (token: string, receiverId: string, initialMessage: string, relatedPetId?: string, relatedProductId?: string) => {
    return apiCall('/messages/conversations/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        receiver_id: receiverId,
        initial_message: initialMessage,
        related_pet_id: relatedPetId,
        related_product_id: relatedProductId,
      }),
    });
  },
  
  markAsRead: async (token: string, conversationId: string) => {
    return apiCall(`/messages/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getUnreadCount: async (token: string) => {
    return apiCall('/messages/unread', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Export all services
export default {
  auth,
  pets,
  products,
  dashboard,
  messages,
};