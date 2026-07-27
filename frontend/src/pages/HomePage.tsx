import { useState } from 'react';
import { useNavigate } from 'react-router';
import ProductList from '../components/products/ProductList';
import useFetchProducts from '../hooks/products/useFetchProducts';
import ProductSkeleton from '../components/products/ProductSkeleton';

export default function Home() {
  const { products, loading, error } = useFetchProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="from-muted/30 to-background min-h-screen bg-gradient-to-br">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="from-primary via-accent to-secondary mb-4 bg-gradient-to-r bg-clip-text text-4xl text-transparent md:text-5xl">
            Descubre Productos Increíbles
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Explora nuestra selección curada de productos de alta calidad a los
            mejores precios
          </p>
        </div>
        {/* Product List */}
        <div className="mb-6 flex justify-center">
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full max-w-lg rounded-md border border-border px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1"
          />
        </div>
        {loading ? (
          <ProductSkeleton />
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-lg text-red-500">Error: {error}</p>
          </div>
        ) : (
          <ProductList
            products={products}
            searchTerm={searchTerm}
            onProductClick={handleProductClick}
          />
        )}
      </main>
    </div>
  );
}
