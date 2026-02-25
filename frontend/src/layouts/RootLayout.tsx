import { Outlet } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
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
