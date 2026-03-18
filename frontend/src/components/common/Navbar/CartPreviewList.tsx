import type { CartItem } from '@/interfaces/cart';

interface CartPreviewListProps {
  items: CartItem[];
}

export default function CartPreviewList({ items }: CartPreviewListProps) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item.productId} className="flex gap-3">
          <div className="bg-muted h-12 w-12 shrink-0 overflow-hidden rounded-md">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
                Sin imagen
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">
              {item.shortDescription}
            </p>
            <p className="text-xs">
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
