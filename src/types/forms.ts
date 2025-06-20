import { z } from 'zod';

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title must be at least 2 characters."),
  genre: z.string().min(1, "Genre must be at least 2 characters."),
  description: z.string().min(1, "Description must be at least 2 characters."),
  coverImage: z.instanceof(FileList).optional(),
  file: z.instanceof(FileList).optional(),
});

export type bookFormData = z.infer<typeof bookFormSchema>;

export const createBookFormSchema = bookFormSchema.extend({
  coverImage: z.instanceof(FileList).refine(
    file=> file.length ===1,
    { message: "Cover image is required"}
  ),
  file: z.instanceof(FileList).refine(
    file => file.length === 1,
    { message: "Book file is required"}
  )
});

export const editBookFromSchem = bookFormSchema;

export type CreateBookFormType = z.infer<typeof createBookFormSchema>;
export type EditFormDataType = z.infer<typeof editBookFromSchem>;