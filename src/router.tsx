import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import CreateBook from "./pages/CreateBook";
import DashbaordLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./config/routes";

const router = createBrowserRouter([
  {
    path: `${ROUTES.ROOT}`,
    element: <DashbaordLayout />,
    children : [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: `${ROUTES.APP.BOOKS}`,
        element: <BooksPage />
      },
      {
        path: `${ROUTES.APP.BOOKS_CREATE}`,
        element: <CreateBook />
      }
    ]
  },
  {
    path: `${ROUTES.AUTH.BASE}`,
    element: <AuthLayout />,
    children: [
      {
        path: `${ROUTES.AUTH.LOGIN}`,
        element: <LoginPage /> 
      },
      {
        path: `${ROUTES.AUTH.REGISTER}`,
        element: <RegisterPage /> 
      }   
    ]
  }
]);

export default router;