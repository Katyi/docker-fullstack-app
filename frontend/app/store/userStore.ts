import { create } from 'zustand';
// import axios from 'axios';
import userService from '@/lib/services/userService';

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

const useUserStore = create<UserState>((set) => ({
  users: [],
  user: null,
  isLoading: true,
  error: null,
  getUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axios.get(`/users`);
      // const users = await response.data;
      const users = await userService.getUsers();
      set({ users, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, users: [] });
    }
  },
  getUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axios.get(`users/${id}`, {
      //   withCredentials: true,
      // });
      // const user = await response.data;
      const user = await userService.getUser(id);
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
      // const response = await axios.post('/users', newUser);
      // const addedUser = await response.data;
      const addedUser = await userService.addUser(newUser);
      set((state) => ({ users: [...state.users, addedUser] }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  updateUser: async (updatedUser: UpdUser) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axios.put(`/users/${updatedUser.id}`, updatedUser);
      // const updatedData = await response.data;
      const updatedData = await userService.updateUser(updatedUser);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === updatedData.id ? updatedData : user
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  deleteUser: async (userId: string) => {
    try {
      // await axios.delete(`/users/${userId}`);
      await userService.deleteUser(userId);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
}));

export default useUserStore;
