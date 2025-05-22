import { create } from 'zustand';
import axios from 'axios';

interface UserState {
  users: User[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  getUser: (id: string) => Promise<void>;
  addUser: (newUser: NewUser) => Promise<void>;
  updateUser: (updatedUser: UpdUser) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

// axios.defaults.baseURL =
//   process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Replace with your API base URL
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useUserStore = create<UserState>((set) => ({
  users: [],
  user: null,
  isLoading: true,
  error: null,
  getUsers: async () => {
    try {
      const response = await axios.get(`/users`);
      const users = await response.data;
      set({ users, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, users: [] });
    }
  },
  getUser: async (id: string) => {
    try {
      const response = await axios.get(`users/${id}`, {
        withCredentials: true,
      });
      const user = await response.data;
      set({ user: user, isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false, user: null });
    }
  },
  addUser: async (newUser: NewUser) => {
    try {
      const response = await apiClient.post('/users', newUser);
      const addedUser = await response.data;
      set((state) => ({ users: [...state.users, addedUser] }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  updateUser: async (updatedUser: UpdUser) => {
    try {
      const response = await apiClient.put(
        `/users/${updatedUser.id}`,
        updatedUser
      );
      const updatedData = await response.data;
      set((state) => ({
        users: state.users.map((user) =>
          user.id === updatedData.id ? updatedData : user
        ),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  deleteUser: async (userId: string) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
}));

export default useUserStore;
