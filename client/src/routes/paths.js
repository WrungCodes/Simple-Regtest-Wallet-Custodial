import HomePage from "../pages";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";

export const paths = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];
