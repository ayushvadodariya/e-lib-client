import { createBook } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateBookResponse {
  data:{
    id: string
  }
}

interface UseCreateBookProp{
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  onSuccess?: (data: CreateBookResponse) => void;
  onError?: (error: unknown) => void;
}

export default function useCreateBook(options: UseCreateBookProp= {}) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation<CreateBookResponse, Error, FormData>({
    mutationFn: async(bookDetail: FormData) => {
      return await createBook(bookDetail) as CreateBookResponse;
    },
    onSuccess: (response: CreateBookResponse) => {
      if(showSuccessToast) {
        toast.success("Book created Successful!",{
          description: "Your book has been added to the library."
        });
      }
      onSuccess?.(response);
    },
    onError: (error: unknown) =>{
      if(showErrorToast) {
        toast.error("Book Creation Failed",{
          description: error instanceof Error ? error.message : "Failed to create book. Please try again."
        })
      }
      onError?.(error);
    }
  });
}