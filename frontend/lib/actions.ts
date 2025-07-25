import axios from 'axios';
import { cookies } from 'next/headers';

axios.defaults.baseURL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

const API_ROUTE_PREFIX = process.env.NODE_ENV === 'production' ? '' : '/api';

// Get user by id
export const getUser = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const response = await axios.get(`${API_ROUTE_PREFIX}/users/${id}`);
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
    const response = await axios.get(`${API_ROUTE_PREFIX}/postcards/${id}`);
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
    const response = await axios.get(`${API_ROUTE_PREFIX}/albums/${id}`, {
      headers: { Cookie: `token=${token?.value}` },
    });
    return await response.data;
  } catch (error) {
    console.log(error);
    return 'Unknown Album';
  }
};
