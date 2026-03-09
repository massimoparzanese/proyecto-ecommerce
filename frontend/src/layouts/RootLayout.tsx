import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import { useAuthInit } from '@/hooks/auth/useAuthInit';

export default function RootLayout() {
  // Sincronizar Redux con el backend al cargar la app
  useAuthInit();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar></Navbar>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer></Footer>
    </div>
  );
}
