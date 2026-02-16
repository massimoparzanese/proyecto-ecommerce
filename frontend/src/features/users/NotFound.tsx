import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="mb-4 text-3xl font-semibold">Página no encontrada</h1>
      <p className="mb-6">La página que buscas no existe.</p>
      <Link
        to="/"
        className="bg-primary inline-block rounded px-4 py-2 text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
