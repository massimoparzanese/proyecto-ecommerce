import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/HomePage';
import NotFound from './pages/NotFoundPage';
import Register from './pages/auth/RegisterPage';
import Login from './pages/auth/LoginPage';
import ProductDetail from './pages/products/ProductDetailPage';

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
