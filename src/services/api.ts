
import axios from 'axios';
import { User, Business, Service, Meeting } from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signIn: async (email: string, password: string) => {
    const response = await api.post('/auth/sign-in', { email, password });
    return response.data;
  },

  signUp: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/sign-up', { name, email, password });
    return response.data;
  }
};

export const businessAPI = {
  getBusiness: async (): Promise<Business> => {
    const response: any = await api.get('/business');
    return response.data[0];
  },

  updateBusiness: async (id: string, business: Partial<Business>): Promise<void> => {
    await api.put(`/business/${id}`, business);
  }
};

export const servicesAPI = {
  getServices: async (): Promise<Service[]> => {
    const response: any = await api.get('/service');
    return response.data;
  },

  getService: async (id: string): Promise<Service> => {
    const response: any = await api.get(`/service/${id}`);
    return response.data;
  },

  createService: async (service: Omit<Service, 'id'>): Promise<void> => {
    await api.post('/service', service);
  },

  updateService: async (id: string, service: Partial<Service>): Promise<void> => {
    await api.put(`/service/${id}`, service);
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/service/${id}`);
  }
};

export const meetingsAPI = {
  getMeetings: async (): Promise<Meeting[]> => {
    const response: any = await api.get('/meeting');
    return response.data;
  },

  getMeeting: async (id: string): Promise<Meeting> => {
    const response: any = await api.get(`/meeting/${id}`);
    return response.data;
  },

  createMeeting: async (meeting: Omit<Meeting, 'id' | 'status'>): Promise<void> => {
    await api.post('/meeting', meeting);
  },

  updateMeeting: async (id: string, meeting: Partial<Meeting>): Promise<void> => {
    await api.put(`/meeting/${id}`, meeting);
  },

  deleteMeeting: async (id: string): Promise<void> => {
    await api.delete(`/meeting/${id}`);
  }
};

export const usersAPI = {
  getUsers: async (): Promise<User[]> => {
    const response: any = await api.get('/user');
    return response.data;
  },

  getUser: async (email: string): Promise<User> => {
    const response: any = await api.get(`/user/${email}`);
    return response.data;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<void> => {
    await api.post('/user', user);
  },

  updateUser: async (email: string, user: Partial<User>): Promise<void> => {
    await api.put(`/user/${email}`, user);
  }
};

export { api }
