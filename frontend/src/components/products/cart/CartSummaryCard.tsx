import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import type { CartSummaryCardProps } from '@/interfaces/cart';

export default function CartSummaryCard({
  totalQuantity,
  subtotal,
  onCheckout,
}: CartSummaryCardProps) {
  return (
    <Card className="h-fit">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">Resumen</h2>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Productos</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="border-border border-t pt-4">
          <div className="mb-4 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <Button className="w-full" onClick={onCheckout}>
            Comprar todo
          </Button>

          <p className="text-muted-foreground mt-3 text-xs">
            Pago en desarrollo. Por ahora puedes gestionar tu carrito y preparar
            la compra.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
