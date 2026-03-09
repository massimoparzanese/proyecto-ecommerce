import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/HomePage';
import NotFound from './pages/NotFoundPage';
import Register from './pages/auth/RegisterPage';
import Login from './pages/auth/LoginPage';
import ProductDetail from './pages/products/ProductDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProduct from './pages/products/ManageProduct';
import { AdminRoute, PublicOnlyRoute } from './components/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: '*', element: <NotFound /> },
      {
        path: 'admin/*',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/product',
        element: (
          <AdminRoute>
            <ManageProduct />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/product/:id',
        element: (
          <AdminRoute>
            <ManageProduct />
          </AdminRoute>
        ),
      },
    ],
  },
]);
export default router;
