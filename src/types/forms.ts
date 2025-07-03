import { z } from 'zod';

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title must be at least 2 characters."),
  genre: z.string().min(1, "Genre must be at least 2 characters."),
  description: z.string().min(1, "Description must be at least 2 characters."),
  coverImage: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        ["image/jpeg", "image/jpg", "image/png"].includes(fileList[0]?.type),
      { message: "Only images are allowed" }
    )
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        fileList[0].size <= 10 * 1024 * 1024,
      { message: "Image must be less than 10MB" }
    ),
  file: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        ["application/pdf", "application/epub+zip"].includes(fileList[0]?.type),
      { message: "Only PDF and EPUB files are allowed" }
    )
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        fileList[0].size <= 50 * 1024 * 1024,
      { message: "File must be less than 50MB" }
    )
});

export type bookFormData = z.infer<typeof bookFormSchema>;

export const createBookFormSchema = bookFormSchema.extend({
  coverImage: bookFormSchema.shape.coverImage.refine(
    file=> file && file.length ===1,
    { message: "Cover image is required"}
  ),
  file: bookFormSchema.shape.file.refine(
    file => file && file.length === 1,
    { message: "Book file is required"}
  )
});

export const editBookFromSchem = bookFormSchema;

export type CreateBookFormType = z.infer<typeof createBookFormSchema>;
export type EditFormDataType = z.infer<typeof editBookFromSchem>;