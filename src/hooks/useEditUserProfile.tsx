import { editUserProfile } from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "@/types/types";

interface useEditUserProfileProp {
  onSuccess?: (updatedUser: unknown) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorTost?: boolean;
}

export default function useEditUserProfile({
  onSuccess: customOnSuccess,
  onError: customOnError,
  showSuccessToast = true,
  showErrorTost= true
}: useEditUserProfileProp) {

  const queryClient = useQueryClient();

  return useMutation<User, Error, FormData>({
    mutationFn: async (data: FormData) => {
      console.log("log from useEditUserProfile hook");
      console.log("FormData entries:");
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      
      const response = await editUserProfile(data);
      return Promise.resolve(response.data as User);
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user']});
      if(showSuccessToast) {
        toast.success("Profile updated successfully");
      }
      customOnSuccess?.(updatedUser);
    },
    onError: (error) => {
      if (error.message === "NO_CHANGES") return; // Do nothing
      if(showErrorTost) {
        toast.error("Failed to update user", {
          description: error instanceof Error ? error.message : "An unknown error"
        });
      }
      customOnError?.(error);
    }
  })
}