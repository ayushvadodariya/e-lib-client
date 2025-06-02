import useTokenStore from "@/store/tokenStore";
import axios from "axios";

const api = axios.create({

  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if(token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
});

export const login = async (data: {email:string, password:string}) => {
  return api.post('/api/users/login', data);
}

export const register= async (data: {name:string, email:string, password:string}) => {
  return api.post('/api/users/register', data);
}

export const getBooks = async () => api.get('/api/books'); 

export const createBook = async (data: FormData)=> api.post('/api/books', data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});