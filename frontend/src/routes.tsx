import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './features/users/Home';
import NotFound from './features/users/NotFound';
import Register from './features/auth/pages/RegisterPage';
import Login from './features/auth/pages/LoginPage';
import ProductDetail from './features/product/pages/ProductDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
export default router;
