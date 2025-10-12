import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://api.dealclick.com'; // Production

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      // Redirect to login
      // router.replace('/auth/signin');
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    userHandle: string;
    phone?: string;
    whatsappNumber?: string;
    company?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    await AsyncStorage.setItem('auth_token', response.data.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('auth_token', response.data.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.post('/auth/me');
    return response.data;
  },
};

// ============================================
// PROPERTIES ENDPOINTS
// ============================================

export const propertiesAPI = {
  getAll: async (filters?: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    beds?: number;
    baths?: number;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await api.get(`/properties/user/${userId}`);
    return response.data;
  },

  create: async (propertyData: any) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  update: async (id: string, propertyData: any) => {
    const response = await api.patch(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },

  like: async (id: string) => {
    const response = await api.post(`/properties/${id}/like`);
    return response.data;
  },

  incrementView: async (id: string) => {
    const response = await api.post(`/properties/${id}/view`);
    return response.data;
  },
};

// ============================================
// REQUIREMENTS ENDPOINTS
// ============================================

export const requirementsAPI = {
  getAll: async (filters?: {
    propertyType?: string;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/requirements', { params: filters });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/requirements/${id}`);
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await api.get(`/requirements/user/${userId}`);
    return response.data;
  },

  create: async (requirementData: {
    requirement: string;
    propertyType?: string;
    location?: string;
    budget?: string;
  }) => {
    const response = await api.post('/requirements', requirementData);
    return response.data;
  },

  update: async (id: string, requirementData: any) => {
    const response = await api.patch(`/requirements/${id}`, requirementData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/requirements/${id}`);
  },

  like: async (id: string) => {
    const response = await api.post(`/requirements/${id}/like`);
    return response.data;
  },
};

// ============================================
// ADVISORS ENDPOINTS
// ============================================

export const advisorsAPI = {
  getAll: async (filters?: {
    estado?: string;
    especialidad?: string;
    empresa?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/advisors', { params: filters });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/advisors/${id}`);
    return response.data;
  },

  getProperties: async (id: string) => {
    const response = await api.get(`/advisors/${id}/properties`);
    return response.data;
  },
};

// ============================================
// USERS ENDPOINTS
// ============================================

export const usersAPI = {
  getOne: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getByHandle: async (handle: string) => {
    const response = await api.get(`/users/handle/${handle}`);
    return response.data;
  },

  update: async (id: string, userData: any) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
};

export default api;

