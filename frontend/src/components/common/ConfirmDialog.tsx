import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import type { ConfirmDialogProps } from '@/interfaces/common';

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
  };

  const iconBgColors = {
    danger: 'bg-red-50 dark:bg-red-950/30',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30',
    info: 'bg-blue-50 dark:bg-blue-950/30',
  };

  const iconColors = {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <dialog
        open
        className="relative z-10 m-0 w-full max-w-md rounded-xl border-2 border-black bg-white p-0 shadow-2xl dark:border-white dark:bg-gray-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Icon */}
        <header className="border-b-2 border-black p-6 dark:border-white">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBgColors[variant]}`}
            >
              <AlertTriangle className={`h-6 w-6 ${iconColors[variant]}`} />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        </header>

        {/* Description */}
        <section className="p-6">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </section>

        {/* Actions */}
        <footer className="border-t-2 border-black p-6 dark:border-white">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-2 border-black text-white dark:border-white"
            >
              {cancelLabel}
            </Button>
            <Button
              className={`${variantColors[variant]} border-2 border-black dark:border-white`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </footer>
      </dialog>
    </div>
  );
}
