import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/HomePage';
import NotFound from './pages/NotFoundPage';
import Register from './pages/auth/RegisterPage';
import Login from './pages/auth/LoginPage';
import ProductDetail from './pages/products/ProductDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/products/AddProduct';

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
      { path: 'admin/*', element: <AdminDashboard /> },
      { path: 'admin/product', element: <AddProduct /> },
    ],
  },
]);
export default router;
