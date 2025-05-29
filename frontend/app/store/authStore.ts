import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  users: User[];
  error: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    name: string;
    email: string;
    country?: string;
    city?: string;
    birthday?: string;
    imageUrl?: string;
    about?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  getUsers: () => Promise<void>;
  getUser: (id: string) => Promise<void>;
  addUser: (newUser: NewUser) => Promise<void>;
  updateUser: (updatedUser: UpdUser) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
// axios.defaults.baseURL = 'http://212.113.120.58:4000';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      users: [],
      error: null,
      isLoggedIn: false,
      isLoading: false,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/login', credentials, {
            withCredentials: true,
          });
          const { user } = response.data;
          set({ user, isLoggedIn: true, isLoading: false });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          set({
            user: null,
            error:
              error.response?.data?.message || 'An error occurred during login',
            isLoggedIn: false,
            isLoading: false,
          });
        }
      },
      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/register', credentials, {
            withCredentials: true,
          });
          const { user } = response.data;
          set({ user, isLoading: false, isLoggedIn: true });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          set({
            user: null,
            error:
              error.response?.data?.message ||
              'An error occurred during registration',
            isLoggedIn: false,
            isLoading: false,
          });
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await axios.get('/auth/logout', { withCredentials: true });
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({
            user: null,
            error: null,
            isLoggedIn: false,
            isLoading: false,
          });
        }
      },
      getUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`/users`);
          const users = await response.data;
          set({ users, isLoading: false, error: null });
        } catch (error: unknown) {
          set({ error: (error as Error).message, isLoading: false, users: [] });
        }
      },
      getUser: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`users/${id}`, {
            withCredentials: true,
          });
          const user = await response.data;
          set({ user: user, isLoading: false, error: null });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
            user: null,
          });
        }
      },
      addUser: async (newUser: NewUser) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/users', newUser);
          const addedUser = await response.data;
          set((state) => ({ users: [...state.users, addedUser] }));
        } catch (error: unknown) {
          set({ error: (error as Error).message });
        }
      },
      updateUser: async (updatedUser: UpdUser) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(
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
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`/users/${userId}`);
          set((state) => ({
            users: state.users.filter((user) => user.id !== userId),
          }));
        } catch (error: unknown) {
          set({ error: (error as Error).message });
        }
      },
    }),
    {
      name: 'userLoginStatus',
    }
  )
);

export default useAuthStore;
