import { deleteBook } from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface useDeleteBookProp {
  onSuccess?: (deleteBookId: string) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useDeleteBook(options: useDeleteBookProp ={}) {

  const {
    onSuccess: customOnSuccess,
    onError: customOnError,
    showErrorToast = true,
    showSuccessToast = true
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => {
      return deleteBook(bookId);
    },
    onSuccess: (data, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['books']});

      if(showSuccessToast){
        toast.success("Book deleted successfully!");
      }

      customOnSuccess?.(bookId);

    },
    onError: (error) => {
      if(showErrorToast){
        toast.error("Failed to delete book", {
          description: error instanceof Error ? error.message : "An unknown error occurred"
        });
      }

      customOnError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  });
}