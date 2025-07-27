import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const imageService = {
  imageUpload: async (file: FormData) => {
    try {
      const response = await axios.post('/api/upload/image-upload', file);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  imageDelete: async (fileName: string) => {
    try {
      const response = await axios.delete('/api/upload/image-delete', {
        data: { fileName },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default imageService;
