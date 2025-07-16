import axios from 'axios';
import { cookies } from 'next/headers';

axios.defaults.baseURL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

// Get user by id
export const getUser = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Get postcard by id
export const getPostcard = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const response = await axios.get(`/api/postcards/${id}`);
    return await response.data;
  } catch (error) {
    return error;
  }
};

// Get album by id
export const getAlbum = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const response = await axios.get(`/api/albums/${id}`, {
      headers: { Cookie: `token=${token?.value}` },
    });
    return await response.data;
  } catch (error) {
    console.log(error);
    return 'Unknown Album';
  }
};
