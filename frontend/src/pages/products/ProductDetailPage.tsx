import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/common/button';
import { Card, CardContent } from '@/components/common/card';
import ReviewSection from '@/components/common/ReviewSection';
import type { Review, Product } from '@/interfaces/product';
import { ShoppingCart, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { toast } from 'sonner';
import apiFetch from '@/utils/api';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(`/products/${id}`);

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Error al procesar los datos del producto');
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl">Producto no encontrado</h2>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('productReviews', JSON.stringify(updatedReviews));
  };

  const handleBuyClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para comprar');
      navigate('/login');
    } else {
      toast.success('¡Producto agregado al carrito!');
    }
  };

  return (
    <div className="from-muted/30 to-background min-h-screen bg-gradient-to-br">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a productos
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Slider de imágenes del producto */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="slider">
                {product.images?.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${product.name} - ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="text-muted-foreground mb-2 text-sm">
                {product.category}
              </div>
              <h1 className="mb-4 text-4xl">{product.name}</h1>
              <div className="mb-6 flex items-baseline gap-4">
                <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-5xl font-semibold text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                {product.stock < 10 && (
                  <span className="text-destructive text-sm">
                    ¡Solo quedan {product.stock} unidades!
                  </span>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-3">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Características */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="text-primary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm">Envío gratis</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="text-accent mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm">Garantía 1 año</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="text-secondary mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm">Stock: {product.stock}</p>
                </CardContent>
              </Card>
            </div>

            {/* Botón de compra o iniciar sesión */}
            <div className="space-y-3">
              {localStorage.getItem('isLoggedIn') === 'true' ? (
                <Button
                  onClick={handleBuyClick}
                  className="from-primary to-accent h-12 w-full bg-gradient-to-r text-lg transition-opacity hover:opacity-90"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock === 0 ? 'Agotado' : 'Comprar Ahora'}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="from-primary to-accent h-12 w-full bg-gradient-to-r text-lg transition-opacity hover:opacity-90"
                >
                  Iniciar Sesión
                </Button>
              )}
              <p className="text-muted-foreground text-center text-xs">
                {product.stock === 0
                  ? 'Este producto está temporalmente agotado'
                  : 'Compra segura y protegida'}
              </p>
            </div>
          </div>
        </div>

        {/* Productos relacionados - Se implementará cuando tengamos un contexto global de productos */}

        {/* Sección de reseñas */}
        <div className="mt-16">
          <ReviewSection
            productId={product.id}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        </div>
      </main>
    </div>
  );
}
