import { useQuery } from "@tanstack/react-query";

interface UseBookBlobOptions {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}

export default function useBookBlob(fileUrl: string | null, options: UseBookBlobOptions = {}) {
  const { 
    staleTime= 10 * 60 * 1000,
    gcTime= 60 * 60 * 1000,
    enabled= true,
  } = options

  return useQuery({
    queryKey: ['book-blob', fileUrl],
    queryFn: async () => {
      if(!fileUrl) {
        throw new Error('No file URL provided');
      }

      const response = await fetch(fileUrl);
      
      if(!response.ok) {
        throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      return {
        blob,
        blobUrl,
        size: blob.size,
        type: blob.type
      };
    },
    enabled: enabled && !!fileUrl,
    staleTime,
    gcTime,
    retry: 2
  });
}