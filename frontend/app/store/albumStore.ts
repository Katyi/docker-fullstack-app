import { create } from 'zustand';
import axios from 'axios';
import { redirect } from 'next/navigation';

interface AlbumState {
  albums: Album[];
  albumsCount: number;
  album: Album | null;
  isLoading: boolean;
  error: string | null;
  getAlbums: (userId: string, skip: number, take: number) => Promise<void>;
  getAlbum: (id: string) => Promise<void>;
  addAlbum: (newAlbum: NewAlbum) => Promise<void>;
  updateAlbum: (updatedAlbum: UpdateAlbum) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
  getUserAlbumCount: (userId: string) => Promise<void>;
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

// get albums of a user
const useAlbumStore = create<AlbumState>((set) => ({
  albums: [],
  albumsCount: 0,
  album: null,
  isLoading: true,
  error: null,
  getAlbums: async (userId: string, skip: number, take: number) => {
    const params = {
      skip: skip,
      take: take,
    };
    try {
      const response = await axios.get(`/albums/user/${userId}`, {
        params,
        withCredentials: true,
      });
      const albums = await response.data;
      set({ albums: albums, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, albums: [] });
      // redirect('/login');
    }
  },
  getUserAlbumCount: async (userId: string) => {
    try {
      const response = await axios.get(`/albums/user/count/${userId}`, {
        withCredentials: true,
      });
      const albumsCount = await response.data;
      set({ albumsCount: albumsCount, isLoading: false, error: null });
    } catch (error: unknown) {
      set({
        error: (error as Error).message,
        isLoading: false,
        albumsCount: 1,
      });
    }
  },
  getAlbum: async (id: string) => {
    try {
      const response = await axios.get(`/albums/${id}`, {
        withCredentials: true,
      });
      const album = await response.data;
      set({ album: album, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, album: null });
      // redirect('/login');
    }
  },
  addAlbum: async (newAlbum: NewAlbum) => {
    try {
      const response = await axios.post('/albums', newAlbum, {
        withCredentials: true,
      });
      const album = await response.data;
      set({ album: album, isLoading: false, error: null });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isLoading: false, albums: [] });
      redirect('/login');
    }
  },
  updateAlbum: async (updatedAlbum: UpdateAlbum) => {
    try {
      const response = await axios.put(
        `/albums/${updatedAlbum.id}`,
        updatedAlbum,
        { withCredentials: true }
      );
      const updatedData = await response.data;
      set((state) => ({
        albums: state.albums.map((album) =>
          album.id === updatedData.id ? updatedData : album
        ),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
  deleteAlbum: async (albumId: string) => {
    try {
      await axios.delete(`/albums/${albumId}`, { withCredentials: true });
      set((state) => ({
        albums: state.albums.filter((album) => album.id !== albumId),
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    }
  },
}));

export default useAlbumStore;
