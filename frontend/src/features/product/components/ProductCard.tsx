import { ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/components/button';
import { Card, CardContent, CardFooter } from '@/shared/components/card';
import { Link } from 'react-router';
import type { ProductCardProps } from '@/interfaces/product';

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
          {product.stock < 10 && (
            <div className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-md px-2 py-1 text-xs">
              ¡Pocas unidades!
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="text-muted-foreground mb-1 text-xs">
            {product.category}
          </div>
          <h3 className="mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary text-2xl font-semibold">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-xs">
              Stock: {product.stock}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="from-primary to-accent w-full bg-gradient-to-r transition-opacity hover:opacity-90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver Detalles
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
