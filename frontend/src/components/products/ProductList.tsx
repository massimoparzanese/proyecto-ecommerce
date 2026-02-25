import ProductCard from './ProductCard';
import type { ProductListProps, Product } from '@/interfaces/product';

export default function ProductList({
  products,
  searchTerm,
  onProductClick,
}: ProductListProps & { onProductClick: (product: Product) => void }) {
  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section>
      {filteredProducts.length > 0 ? (
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map(product => (
            <li key={product.id} onClick={() => onProductClick(product)}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            No se encontraron productos que coincidan con tu búsqueda
          </p>
        </div>
      )}
    </section>
  );
}
