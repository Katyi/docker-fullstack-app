import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const userService = {
  async getUsers() {
    try {
      const response = await axios.get(`/api/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getUser(id: string) {
    try {
      const response = await axios.get(`/api/users/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addUser(newUser: NewUser) {
    try {
      const response = await axios.post('/api/users', newUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateUser(updatedUser: UpdUser) {
    try {
      const response = await axios.put(
        `/api/users/${updatedUser.id}`,
        updatedUser
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteUser(userId: string) {
    try {
      const response = await axios.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
