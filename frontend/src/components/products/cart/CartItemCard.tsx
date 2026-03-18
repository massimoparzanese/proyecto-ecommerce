import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import type { CartItemCardProps } from '@/interfaces/cart';

export default function CartItemCard({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="bg-muted h-24 w-24 shrink-0 overflow-hidden rounded-lg">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                Sin imagen
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="line-clamp-1 text-lg font-medium">
                  {item.name}
                </h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {item.shortDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.productId, item.name)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Eliminar ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="font-semibold">${item.price.toFixed(2)}</p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onDecrease(item.productId)}
                  aria-label={`Disminuir cantidad de ${item.name}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onIncrease(item.productId)}
                  disabled={item.quantity >= item.stock}
                  aria-label={`Aumentar cantidad de ${item.name}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
