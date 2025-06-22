import { register } from "@/http/api";
import useTokenStore from "@/store/tokenStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface RegisterCredential {
  name: string,
  email: string,
  password: string
}

interface RegisterResponse  {
  data:{
    accessToken: string,
    message?: string
  }
}
interface useRegisterProp  {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: unknown) => void;
}
export default function useRegister(options: useRegisterProp = {}) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  const setToken = useTokenStore(state => state.setToken);

  return useMutation<RegisterResponse, Error, RegisterCredential>({
    mutationFn: async(credentials: RegisterCredential) => {
      return await register(credentials) as RegisterResponse;
    },
    onSuccess: (response: RegisterResponse) => {
      setToken(response.data.accessToken);
      if(showSuccessToast) {
        toast.success("Register Successful!",{
          description: "Welcome! Redirecting..."
        });
      }
      onSuccess?.(response);
    },
    onError: (error: unknown) =>{
      if(showErrorToast) {
        toast.error("Registration Failed",{
          description: error instanceof Error ? error.message : "Registration failed. Please try again"
        })
      }
      onError?.(error);
    },
    retry: false 
  }); 
}