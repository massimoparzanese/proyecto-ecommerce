import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/common/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import useFetchCategories from '@/hooks/products/useFetchCategories';
import useFetchProduct from '@/hooks/products/useFetchProduct';
import { toast } from 'sonner';
import apiFetch from '@/utils/api';
import type { ProductFormData } from '@/interfaces/product';

export default function ManageProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Fetch categories
  const {
    categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useFetchCategories();

  // Fetch product data if in edit mode
  const {
    formData: initialFormData,
    isLoading,
    error: fetchError,
  } = useFetchProduct(id);

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialFormData && initialFormData.name && !hasInitialized.current) {
      setFormData(initialFormData);
      hasInitialized.current = true;
    }
  }, [initialFormData]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError);
      navigate('/admin');
    }
  }, [fetchError, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Prevenir doble submit
    if (isSubmitting) return;

    // Validar que si es nueva categoría, tenga nombre
    const categoryToUse = isNewCategory
      ? newCategoryName.trim()
      : formData.category;

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !categoryToUse ||
      !formData.stock
    ) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar los datos del producto
      const validImages = formData.images.filter(img => img.trim() !== '');
      const imagesToSend =
        validImages.length > 0
          ? validImages
          : [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            ];

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: categoryToUse,
        stock: parseInt(formData.stock),
        images: imagesToSend,
      };

      // Use PUT for edit, POST for create
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `/products/${id}` : '/products';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(productData),
      });

      await response.json(); // Consumir respuesta

      // Si es una nueva categoría, hacer refetch de categorías
      if (isNewCategory && newCategoryName.trim()) {
        await refetchCategories();
      }

      toast.success(
        isEditMode
          ? '¡Producto actualizado exitosamente!'
          : '¡Producto agregado exitosamente!'
      );
      navigate('/admin');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(
        errorMessage ||
          (isEditMode
            ? 'Error al actualizar el producto'
            : 'Error al crear el producto')
      );
      console.error('Error managing product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Omit<ProductFormData, 'images'>,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (formData.images.length < 5) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    } else {
      toast.info('Máximo 5 imágenes permitidas');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  if (isLoading) {
    return (
      <div className="from-muted/30 to-background flex min-h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground mt-4">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="from-muted/30 to-background min-h-screen bg-linear-to-br">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader className="relative">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="absolute top-4 left-4 border-2 border-black dark:border-white"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <CardTitle className="from-primary to-accent bg-linear-to-r bg-clip-text pt-8 text-3xl text-transparent">
              {isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Modifica la información del producto'
                : 'Completa la información del producto para agregarlo al catálogo'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              formData={formData}
              categories={categories}
              categoriesLoading={categoriesLoading}
              onSubmit={handleSubmit}
              onChange={handleChange}
              isNewCategory={isNewCategory}
              onToggleNewCategory={setIsNewCategory}
              newCategoryName={newCategoryName}
              onNewCategoryChange={setNewCategoryName}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              onImageChange={handleImageChange}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
