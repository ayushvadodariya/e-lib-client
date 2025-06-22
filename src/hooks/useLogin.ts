import { login } from "@/http/api";
import useTokenStore from "@/store/tokenStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  data:{
    accessToken: string,
    message?: string
  }
}

interface UseLoginProp {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: unknown) => void;
}

export default function useLogin(options: UseLoginProp = {}) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  const setToken = useTokenStore(state => state.setToken);

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async(credentials) => {
      return await login(credentials) as LoginResponse;
    },
    onSuccess: (response: LoginResponse) => {
      setToken(response.data.accessToken);
      if(showSuccessToast) {
        toast.success("Login Successful!",{
          description: "Welcome back! Redirecting..."
        });
      }
      onSuccess?.(response);
    },
    onError: (error: unknown) =>{
      if(showErrorToast) {
        toast.error("Login Failed",{
          description: error instanceof Error ? error.message : "Login failed. Please try again"
        })
      }
      onError?.(error);
    },
    retry: false 
  });

}
