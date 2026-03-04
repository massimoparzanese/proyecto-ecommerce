import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { Button } from '@/components/common/button';
import {
  Plus,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';
import type { AdminStatisticsProps } from '@/interfaces/admin';

export default function AdminStatistics({
  totalProducts,
  totalValue,
  lowStockProducts,
}: AdminStatisticsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Total Productos
          </CardTitle>
          <Package className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalProducts}</div>
          <p className="text-muted-foreground mt-1 text-xs">En catálogo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Valor Inventario
          </CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">${totalValue.toFixed(2)}</div>
          <p className="text-muted-foreground mt-1 text-xs">
            Valor total del stock
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Stock Bajo
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-2xl font-semibold">
            {lowStockProducts}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Productos con menos de 10 unidades
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Acciones
          </CardTitle>
          <ShoppingCart className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Link to="/admin/product">
            <Button className="from-primary to-accent w-full bg-gradient-to-r hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
