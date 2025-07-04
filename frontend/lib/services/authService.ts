import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const authService = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axios.post('/auth/login', credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(credentials: {
    name: string;
    email: string;
    country?: string;
    city?: string;
    birthday?: string;
    imageUrl?: string;
    about?: string;
    password: string;
  }) {
    try {
      const response = await axios.post('/auth/register', credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await axios.get('/auth/logout', { withCredentials: true });
    } catch (error) {
      throw error;
    }
  },

  async checkAuth() {
    try {
      const response = await axios.get('/auth/me', { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
