import { create } from 'zustand';
import axios from 'axios';

interface LikeState {
  likes: Like[];
  likesWithPostcards: Like[];
  likesCount: number;
  like: Like | null;
  isLoading: boolean;
  error: string | null;
  getLikes: (userId: string) => Promise<void>;
  getUserLikesCount: (userId: string) => Promise<void>;
  getLikesWithPostcards: (
    userId: string,
    skip: number,
    take: number
  ) => Promise<void>;
  // getAlbum: (id: string) => Promise<void>;
  addLike: (newLike: newLike) => Promise<void>;
  // updateAlbum: (updatedAlbum: UpdateAlbum) => Promise<void>;
  deleteLike: (id: string) => Promise<void>;
  deleteLikesOfPostcard: (postcardId: string) => Promise<void>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const useLikeStore = create<LikeState>((set) => ({
  likes: [],
  likesWithPostcards: [],
  likesCount: 0,
  like: null,
  isLoading: true,
  error: null,
  getLikes: async (userId: string) => {
    try {
      const response = await axios.get(`/likes/user/${userId}`, {
        withCredentials: true,
      });
      const likes = await response.data;
      set({ likes: likes, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, likes: [] });
      // redirect('/login');
    }
  },
  getUserLikesCount: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/likes/userLikes/count/${userId}`, {
        withCredentials: true,
      });
      const likesCount = await response.data;
      set({ likesCount: likesCount, isLoading: false, error: null });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        likesCount: 1,
      });
    }
  },
  getLikesWithPostcards: async (userId: string, skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    try {
      const response = await axios.get(`/likes/userLikes/${userId}`, {
        params,
        withCredentials: true,
      });
      const likesWithPostcards = await response.data;
      set({
        likesWithPostcards: likesWithPostcards,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, likes: [] });
    }
  },
  addLike: async (newLike: newLike) => {
    try {
      const response = await axios.post('/likes', newLike, {
        withCredentials: true,
      });
      const like = await response.data;
      set({ like: like, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, likes: [] });
      // redirect('/login');
    }
  },
  deleteLike: async (id: string) => {
    try {
      await axios.delete(`/likes/${id}`, { withCredentials: true });
      set((state) => ({
        likes: state.likes.filter((like) => like.id !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, likes: [] });
    }
  },
  deleteLikesOfPostcard: async (postcardId: string) => {
    try {
      await axios.delete(`/likes/postcard/${postcardId}`, {
        withCredentials: true,
      });
      set((state) => ({
        likes: state.likes.filter((like) => like.postcardId !== postcardId),
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, likes: [] });
    }
  },
}));

export default useLikeStore;
