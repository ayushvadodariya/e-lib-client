import { type Book } from '@/types/types';
import { updateBook } from "@/http/api";
import type { EditFormDataType } from "@/types/forms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

interface UseEditBookProp {
  editingBook: Book | null;
  onSuccess?: (updateBook: unknown) => void;
  onError?: (error: Error, formData: EditFormDataType) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useEditBook({
  editingBook,
  onSuccess: customOnSuccess,
  onError: customOnError,
  showErrorToast,
  showSuccessToast
}: UseEditBookProp) {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditFormDataType )=>{
      if (!editingBook) {
        throw new Error("No book selected for editing");
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('genre', data.genre);
      formData.append('description', data.description);

      if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]);
      }

      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]);
      }

      return updateBook(editingBook._id, formData);
    },
    onSuccess: (updatedBook) => {

      queryClient.invalidateQueries({ queryKey: ['books']});

      if(showSuccessToast) {
        toast.success("Book updates successfully!");
      }

      customOnSuccess?.(updatedBook);
    },
    onError: (error, formData) => {
      if(showErrorToast) {
        toast.error("Failed to update book",{
          description: error instanceof Error ? error.message : "An unknown error occurred"
        });
      }
      customOnError?.(
        error instanceof Error ? error : new Error('Unknown error'),
        formData
      );
    }
  });
}