import authService from '@/lib/services/authService';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
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
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      isLoggedIn: false,
      isLoading: false,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.login(credentials);
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
          const { user } = await authService.register(credentials);
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
          await authService.logout();
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
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.checkAuth();
          set({ user, isLoggedIn: true, isLoading: false });
        } catch (error) {
          const axiosError = error as AxiosError<{ message: string }>;
          if (axiosError.response?.status === 401) {
            set({
              user: null,
              isLoggedIn: false,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              error: axiosError.message,
              user: null,
              isLoggedIn: false,
              isLoading: false,
            });
          }
        }
      },
    }),
    {
      name: 'userLoginStatus',
    }
  )
);

export default useAuthStore;
