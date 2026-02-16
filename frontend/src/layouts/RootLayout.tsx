import { Outlet } from 'react-router-dom';
import Footer from '../shared/components/Footer';
import Navbar from '../shared/components/Navbar';
export default function RootLayout() {
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
