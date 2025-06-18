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

export const formSchema = z.object({
  title: z.string().min(2, "title must be at least 2 characters."),
  genre: z.string().min(2, "Genre must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  coverImage: z.instanceof(FileList).refine(
    file => file.length === 1,
    { message: "Cover image is required" }
  ),
  file: z.instanceof(FileList).refine(
    file => file.length === 1,
    { message:  "Book file is required" }
  )
});

export type formDataType = z.infer<typeof formSchema>;