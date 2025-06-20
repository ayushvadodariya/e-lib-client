import { z } from 'zod';

export interface User {
  id: string,
  name?: string,
  email?: string
}

export interface Author {
  _id: string,
  name: string,

} 
export interface Book {
  _id: string,
  title: string,
  description: string,
  genre: string,
  author: Author,
  coverImage: string,
  file: string,
  createdAt: string
}
