import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const postcardService = {
  getUserPostcards: async (userId: string, skip: number, take: number) => {
    try {
      const params = { skip, take };
      const response = await axios.get(`/postcards/user/${userId}`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPostcardsCount: async (userId: string) => {
    try {
      const response = await axios.get(`/postcards/count/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllPublicPostcards: async (skip: number, take: number) => {
    try {
      const params = { skip, take };
      const response = await axios.get('/postcards/public', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllPublicPostcardsCount: async () => {
    try {
      const response = await axios.get('/postcards/publicCount');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPublicPostcards: async (userId: string, skip: number, take: number) => {
    try {
      const params = { skip, take };
      const response = await axios.get(`/postcards/public/${userId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPublicPostcardsCount: async (userId: string) => {
    try {
      const response = await axios.get(`/postcards/count/public/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPostcardByAlbumId: async (albumId: string, skip: number, take: number) => {
    try {
      const params = { skip, take };
      const response = await axios.get(`/postcards/inalbum/${albumId}`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPostcardByAlbumIdCount: async (albumId: string) => {
    try {
      const response = await axios.get(`/postcards/inalbum/count/${albumId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPostcard: async (id: string) => {
    try {
      const response = await axios.get(`/postcards/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPostcard: async (newPostcard: NewPostcard) => {
    try {
      const response = await axios.post('/postcards', newPostcard, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePostcard: async (updatePostcard: Postcard) => {
    try {
      const response = await axios.put(
        `/postcards/${updatePostcard.id}`,
        updatePostcard,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePostcard: async (postcardId: string) => {
    try {
      await axios.delete(`/postcards/${postcardId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default postcardService;
