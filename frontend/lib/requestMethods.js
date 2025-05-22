import axios from 'axios';

export const BASE_URL = 'http://212.113.120.58:8000/api/';

export const userRequest = axios.create({
  baseURL: BASE_URL,
});
