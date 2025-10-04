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

export const userDetail = async () => 
  api.get('/api/users');

export const login = async (data: {email:string, password:string}) => 
  api.post('/api/users/login', data);

export const register= async (data: {name:string, email:string, password:string}) => 
  api.post('/api/users/register', data);

export const editUserProfile = async (data: FormData) => 
  api.patch(`/api/users`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const getBooks = async () => 
  api.get('/api/books'); 

export const createBook = async (data: FormData) => 
  api.post('/api/books', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const updateBook = async ( bookId: string, data: FormData) => 
  api.patch(`/api/books/${bookId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteBook = async (bookId: string) => 
  api.delete(`/api/books/${bookId}`);

export const fetchFileAsBlob = async (url: string) => 
  // axios.get(url,{
  //   responseType: 'blob'
  // }); 
  api.get(`/api/books/getPdf?url="${url}"`);