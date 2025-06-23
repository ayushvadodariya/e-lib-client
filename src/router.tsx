import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import CreateBook from "./pages/CreateBook";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./config/routes";
import ReadBook from "./pages/ReadBook";

const router = createBrowserRouter([
  {
    path: `${ROUTES.ROOT}`,
    element: <AppLayout/>,
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
      },
      {
        path: `${ROUTES.APP.READ}`,
        element: <ReadBook />
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