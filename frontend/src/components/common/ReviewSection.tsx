import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from './button';
import Textarea from './TextArea';
import { Card, CardContent } from './card';
import { toast } from 'sonner';
import type { ReviewSectionProps } from '@/interfaces/product';

const REVIEWS_PER_PAGE = 3;

export default function ReviewSection({
  productId,
  reviews,
  onAddReview,
}: ReviewSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName') || 'Usuario Anónimo';

  // Filtrar reseñas por producto
  const productReviews = reviews.filter(r => r.productId === productId);

  // Calcular paginación
  const totalPages = Math.ceil(productReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = productReviews.slice(startIndex, endIndex);

  // Calcular promedio de calificaciones
  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length
        ).toFixed(1)
      : '0.0';

  const handleSubmitReview = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    onAddReview({
      productId,
      userId: 'currentUser',
      userName,
      rating,
      comment: comment.trim(),
    });

    setComment('');
    setRating(5);
    setShowReviewForm(false);
    toast.success('¡Reseña publicada exitosamente!');
  };

  // Reset page when product changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productId]);

  return (
    <div className="space-y-6">
      {/* Resumen de calificaciones */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-2xl">Reseñas de Clientes</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(parseFloat(averageRating))
                          ? 'fill-secondary text-secondary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold">{averageRating}</span>
                <span className="text-muted-foreground">
                  ({productReviews.length}{' '}
                  {productReviews.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            </div>
            {isLoggedIn && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="from-primary to-secondary bg-gradient-to-r hover:opacity-90"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {showReviewForm ? 'Cancelar' : 'Escribir Reseña'}
              </Button>
            )}
          </div>

          {/* Formulario de nueva reseña */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-muted/50 mb-6 rounded-lg p-4"
            >
              <div className="mb-4">
                <label className="mb-2 block">Tu Calificación</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-secondary text-secondary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block">Tu Comentario</label>
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Comparte tu experiencia con este producto..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="from-primary to-secondary bg-gradient-to-r hover:opacity-90"
              >
                Publicar Reseña
              </Button>
            </form>
          )}

          {/* Lista de reseñas */}
          {currentReviews.length > 0 ? (
            <div className="space-y-4">
              {currentReviews.map(review => (
                <div
                  key={review.id}
                  className="border-border border-t pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-secondary text-secondary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {new Date(review.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              No hay reseñas todavía. ¡Sé el primero en dejar una!
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-border mt-6 flex items-center justify-center gap-2 border-t pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={
                      currentPage === i + 1
                        ? 'from-primary to-secondary bg-gradient-to-r'
                        : ''
                    }
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoggedIn && (
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <MessageSquare className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground">
              Inicia sesión para dejar tu reseña y ayudar a otros compradores
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
