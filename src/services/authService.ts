import axios from 'axios';
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';

// ✅ Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// ✅ Add request interceptor for Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error("Session expired. Please login again.");
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        toast.error("You don't have permission to access this resource.");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

// ✅ Authentication Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

// ✅ Authentication API Functions
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/signin', loginData);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    throw new Error('Invalid response from server');
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
    throw error;
  }
};

export const signup = async (signupData: SignupRequest): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/signup', signupData);
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error);
    toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  toast.success("Logged out successfully");
};

export const getCurrentUser = (): AuthResponse | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token') && !!getCurrentUser();
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// ✅ Implement token refresh if supported
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('/refresh-token');
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return false;
  }
};

export const authHeader = (): { Authorization: string } | Record<string, never> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default axiosInstance;
