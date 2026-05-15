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
    // First, get the conversation to find the receiver_id
    const conversation: any = await apiCall(`/messages/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const receiverId = conversation.other_participant_id || conversation.data?.other_participant_id;
    
    if (!receiverId) {
      throw new Error('Could not determine receiver');
    }
    
    return apiCall(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        receiver_id: receiverId,
        message_content: content 
      }),
    });
  },
  
  createConversation: async (token: string, receiverId: string, initialMessage: string, relatedPetId?: string, relatedProductId?: string) => {
    const body: any = {
      receiver_id: receiverId,
      initial_message: initialMessage
    };
    if (relatedPetId) {
      body.related_pet_id = relatedPetId;
    }
    if (relatedProductId) {
      body.related_product_id = relatedProductId;
    }
    return apiCall('/messages/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  },
  
  markAsRead: async (token: string, conversationId: string) => {
    return apiCall(`/messages/conversations/${conversationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  getUnreadCount: async (token: string) => {
    return apiCall('/messages/conversations/unread', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Favorites endpoints
export const favorites = {
  getAll: async (token: string) => {
    return apiCall('/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  add: async (token: string, petId: string) => {
    return apiCall(`/favorites/pet/${petId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  remove: async (token: string, petId: string) => {
    return apiCall(`/favorites/pet/${petId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  check: async (token: string, petId: string) => {
    const response: any = await apiCall(`/favorites/check/pet/${petId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { is_favorite: response.is_favorited };
  },
};

// Export all services
export default {
  auth,
  pets,
  products,
  dashboard,
  messages,
  favorites,
};