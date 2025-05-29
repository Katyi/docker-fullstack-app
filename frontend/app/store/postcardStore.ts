import { create } from 'zustand';
import axios from 'axios';
import { redirect } from 'next/navigation';

interface PostcardState {
  postcards: Postcard[];
  postcardsCount: number;
  allPublicPostcards: Postcard[];
  publicPostcardsCount: number;
  publicPostcards: Postcard[];
  userPublicPostcardsCount: number;
  postcardsInAlbum: Postcard[];
  postcardsInAlbumCount: number;
  postcard: Postcard | null;
  isLoading: boolean;
  error: string | null;
  getPostcards: (userId: string, skip: number, take: number) => Promise<void>;
  getUserPostcardsCount: (userId: string) => Promise<void>;
  getAllPublicPostcards: (skip: number, take: number) => Promise<void>;
  getAllPublicPostcardsCount: () => Promise<void>;
  getPublicPostcards: (
    userId: string,
    skip: number,
    take: number
  ) => Promise<void>;
  getPublicPostcardsCount: (userId: string) => Promise<void>;
  getPostcardByAlbumId: (
    albumId: string,
    skip: number,
    take: number
  ) => Promise<void>;
  getPostcardByAlbumIdCount: (albumId: string) => Promise<void>;
  getPostcard: (id: string) => Promise<void>;
  addPostcard: (newPostcard: NewPostcard) => Promise<void>;
  updatePostcard: (updatedPostcard: Postcard) => Promise<void>;
  deletePostcard: (postcardId: string) => Promise<void>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
// axios.defaults.baseURL = 'http://212.113.120.58:4000';

const usePostcardStore = create<PostcardState>((set) => ({
  postcards: [],
  postcardsCount: 0,
  allPublicPostcards: [],
  publicPostcardsCount: 0,
  publicPostcards: [],
  userPublicPostcardsCount: 0,
  postcardsInAlbum: [],
  postcardsInAlbumCount: 0,
  postcard: null,
  isLoading: false,
  error: null,
  // Get postcards of current user
  getPostcards: async (userId: string, skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    set({ isLoading: true, error: null });
    try {
      // Simulate fetching data (replace with your actual API call)
      const response = await axios.get(`/postcards/user/${userId}`, {
        params,
        withCredentials: true,
      });
      const postcards = await response.data;
      set({ postcards: postcards, isLoading: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
      // redirect('/login');
    }
  },
  // Get count of postcards of current user
  getUserPostcardsCount: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/postcards/count/${userId}`);
      const postcardsCount = await response.data;
      set({ postcardsCount: postcardsCount, isLoading: false, error: null });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        postcardsCount: 1,
      });
    }
  },
  // Get all public postcards
  getAllPublicPostcards: async (skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/postcards/public', { params });

      const allPublicPostcards = await response.data;
      set({
        allPublicPostcards: allPublicPostcards,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
    }
  },
  // Get count of all public postcards
  getAllPublicPostcardsCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/postcards/publicCount');
      const publicPostcardsCount = await response.data;
      set({
        publicPostcardsCount: publicPostcardsCount,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        publicPostcardsCount: 1,
      });
    }
  },
  // Get user public postcards
  getPublicPostcards: async (userId: string, skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    try {
      const response = await axios.get(`/postcards/public/${userId}`, {
        params,
      });
      const publicPostcards = await response.data;
      set({ publicPostcards: publicPostcards, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
    }
  },
  // Get count of user public postcards
  getPublicPostcardsCount: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/postcards/count/public/${userId}`);
      const userPublicPostcardsCount = await response.data;
      set({
        userPublicPostcardsCount: userPublicPostcardsCount,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        userPublicPostcardsCount: 0,
      });
    }
  },
  // Get postcards in album
  getPostcardByAlbumId: async (albumId: string, skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    try {
      const response = await axios.get(`/postcards/inalbum/${albumId}`, {
        params,
        withCredentials: true,
      });
      const postcardsInAlbum = await response.data;
      set({
        postcardsInAlbum: postcardsInAlbum,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
    }
  },
  // Get count of postcards in album
  getPostcardByAlbumIdCount: async (albumId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/postcards/inalbum/count/${albumId}`, {
        withCredentials: true,
      });
      const postcardsInAlbumCount = await response.data;
      set({
        postcardsInAlbumCount: postcardsInAlbumCount,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        postcardsInAlbumCount: 1,
      });
    }
  },

  getPostcard: async (id: string) => {
    try {
      const response = await axios.get(`/postcards/${id}`, {
        withCredentials: true,
      });
      const postcard = await response.data;
      set({ postcard: postcard, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
      redirect('/login');
    }
  },
  addPostcard: async (newPostcard: NewPostcard) => {
    try {
      const response = await axios.post('/postcards', newPostcard, {
        withCredentials: true,
      });
      const postcard = await response.data;
      set({ postcard: postcard, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
      redirect('/login');
    }
  },
  updatePostcard: async (updatePostcard: Postcard) => {
    try {
      const response = await axios.put(
        `/postcards/${updatePostcard.id}`,
        updatePostcard,
        { withCredentials: true }
      );
      const updatedData = await response.data;
      set((state) => ({
        postcards: state.postcards.map((postcard) =>
          postcard.id === updatedData.id ? updatedData : postcard
        ),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  deletePostcard: async (postcardId: string) => {
    try {
      await axios.delete(`/postcards/${postcardId}`, {
        withCredentials: true,
      });
      set((state) => ({
        postcards: state.postcards.filter(
          (postcard) => postcard.id !== postcardId
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, postcards: [] });
      // redirect('/login');
    }
  },
}));

export default usePostcardStore;
