import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API Configuration
// Using Railway for both dev and prod since localhost doesn't work in simulators
export const API_BASE_URL = 'https://dealclick-production.up.railway.app';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url);
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.response?.data, error.config?.url);
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
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Login attempt ${attempt}/${maxRetries}`);
        const response = await api.post('/auth/login', { email, password });
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } catch (error: any) {
        lastError = error;
        console.error(`Login attempt ${attempt} failed:`, error.response?.status, error.message);
        
        // If it's a 502 error and we have retries left, wait and try again
        if (error.response?.status === 502 && attempt < maxRetries) {
          console.log(`Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        // If it's not a 502 or we're out of retries, throw the error
        throw error;
      }
    }
    
    throw lastError;
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.removeItem('biometric_email');
    await AsyncStorage.removeItem('biometric_password');
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

// ============================================
// STORAGE ENDPOINTS
// ============================================

export const storageAPI = {
  uploadSingle: async (file: FormData) => {
    const response = await api.post('/storage/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultiple: async (files: FormData) => {
    const response = await api.post('/storage/upload-multiple', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ============================================
// AUTH REFRESH ENDPOINTS
// ============================================

export const authRefreshAPI = {
  biometricLogin: async () => {
    const response = await api.post('/auth/biometric-login');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default api;

