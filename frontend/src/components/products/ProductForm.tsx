import { Link } from 'react-router';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Select } from '@/components/common/select';
import Textarea from '@/components/common/TextArea';
import { Save, Image as ImageIcon, Plus, X } from 'lucide-react';
import type { ProductFormProps } from '@/interfaces/product';

export default function ProductForm({
  formData,
  categories,
  categoriesLoading,
  onSubmit,
  onChange,
  isNewCategory,
  onToggleNewCategory,
  newCategoryName,
  onNewCategoryChange,
  onAddImage,
  onRemoveImage,
  onImageChange,
  isSubmitting = false,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Producto *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ej: Smartphone Galaxy X"
          value={formData.name}
          onChange={e => onChange('name', e.target.value)}
          className="border-2! border-black! dark:border-white!"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          placeholder="Describe las características principales del producto..."
          value={formData.description}
          onChange={e => onChange('description', e.target.value)}
          rows={4}
          className="border-2! border-black! dark:border-white!"
          required
        />
      </div>

      <fieldset className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <legend className="sr-only">Información de inventario</legend>
        <div className="space-y-2">
          <Label htmlFor="price">Precio ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="99.99"
            value={formData.price}
            onChange={e => onChange('price', e.target.value)}
            className="border-2! border-black! dark:border-white!"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="50"
            value={formData.stock}
            onChange={e => onChange('stock', e.target.value)}
            className="border-2! border-black! dark:border-white!"
            required
          />
        </div>
      </fieldset>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="category">Categoría *</Label>
          <button
            type="button"
            onClick={() => onToggleNewCategory(!isNewCategory)}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isNewCategory
              ? '← Seleccionar existente'
              : '+ Crear nueva categoría'}
          </button>
        </div>

        {isNewCategory ? (
          <div className="space-y-2">
            <Input
              id="newCategory"
              type="text"
              placeholder="Ej: Electrónica, Ropa, etc."
              value={newCategoryName}
              onChange={e => onNewCategoryChange(e.target.value)}
              className="border-2! border-black! dark:border-white!"
              required
            />
            <p className="text-muted-foreground text-xs">
              Se creará una nueva categoría con este nombre
            </p>
          </div>
        ) : (
          <Select
            id="category"
            value={formData.category}
            onChange={e => onChange('category', e.target.value)}
            className="border-2! border-black! dark:border-white!"
            required
            disabled={categoriesLoading}
          >
            <option value="" disabled>
              {categoriesLoading
                ? 'Cargando categorías...'
                : 'Selecciona una categoría'}
            </option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Imágenes del Producto (opcional, máx. 5)</Label>
          {formData.images.length < 5 && (
            <button
              type="button"
              onClick={onAddImage}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              Agregar imagen
            </button>
          )}
        </div>

        <div className="space-y-3">
          {formData.images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id={`image-${index}`}
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={image}
                    onChange={e => onImageChange(index, e.target.value)}
                    className="border-2! border-black! pl-10 dark:border-white!"
                  />
                </div>
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
                    className="border-destructive text-destructive hover:bg-destructive transition-colors hover:text-white dark:hover:text-white"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-4 w-4 shrink-0" />
                  </Button>
                )}
              </div>

              {image && (
                <div className="border-border overflow-hidden rounded-lg border">
                  <img
                    src={image}
                    alt={`Vista previa ${index + 1}`}
                    className="h-32 w-full object-cover"
                    onError={e => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-xs">
          Si no proporcionas imágenes, se usará una por defecto
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="from-primary to-accent flex-1 bg-linear-to-r hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
        <Link to="/admin" className="flex-1">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="w-full border-2 border-gray-300 bg-white text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
