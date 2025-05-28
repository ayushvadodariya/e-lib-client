import useTokenStore from "@/store/tokenStore";
import { Navigate, Outlet } from "react-router-dom"

function AuthLayout() {
  const token = useTokenStore((state)=> state.token);
  
  if(token){
    return <Navigate to={'/dashboard/home'} replace />
  }
  return (
    <>
      <Outlet />
    </>
  )
}

export default AuthLayout