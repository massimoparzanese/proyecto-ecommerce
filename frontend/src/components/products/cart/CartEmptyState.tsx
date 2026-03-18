import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import type { CartEmptyStateProps } from '@/interfaces/cart';

export default function CartEmptyState({
  productsPath = '/',
}: CartEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-14 text-center">
        <ShoppingBag className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
        <h2 className="mb-2 text-xl">Tu carrito esta vacio</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Agrega productos para verlos aqui y comprarlos en un solo paso.
        </p>
        <Button asChild>
          <Link to={productsPath}>Ir a productos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
