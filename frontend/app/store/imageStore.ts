import { create } from 'zustand';
import imageService from '@/lib/services/imageService';

interface ImageState {
  isLoading: boolean;
  error: string | null;
  uploadedImage: {
    imageUrl: string;
    width: number;
    height: number;
    fileName: string;
  } | null;
  uploadImage: (file: FormData) => Promise<void>;
  deleteImage: (fileName: string) => Promise<void>;
  clear: () => void;
}

const useImageStore = create<ImageState>((set) => ({
  isLoading: false,
  error: null,
  uploadedImage: null,

  uploadImage: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const data = await imageService.imageUpload(file);
      set({ uploadedImage: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Upload error', isLoading: false });
    }
  },

  deleteImage: async (fileName) => {
    set({ isLoading: true, error: null });
    try {
      await imageService.imageDelete(fileName);
      set({ uploadedImage: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Delete error', isLoading: false });
    }
  },

  clear: () => set({ uploadedImage: null, error: null }),
}));

export default useImageStore;
