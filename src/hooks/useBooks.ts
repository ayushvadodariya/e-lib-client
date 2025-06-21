import { getBooks } from "@/http/api";
import { useUserStore } from "@/store/userStore";
import type { Book } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

interface UseBooksOptions {
  enabled? : boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useBooks(options: UseBooksOptions = {}) {
  const user = useUserStore(state => state.user);

  const {
    enabled = true,
    staleTime = 1000 * 60 * 30, // 5 minutes
    gcTime =  60 * 60 * 1000     // 60 minutes
    } = options || {};

  const query = useQuery<Book[]>({
    queryKey: ['books', user?.id],
    queryFn: async () => {
      const response = await getBooks();
      return response.data as Book[];
    },
    enabled: enabled && !!user?.id,
    staleTime, // 5 minutes
    gcTime,
  });

  return {
    books: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess
  }
}