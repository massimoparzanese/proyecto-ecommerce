import { User } from 'lucide-react';
import type { UserMenuButtonProps } from '@/interfaces/navbar';

/**
 * Botón de menú de usuario
 */
export const UserMenuButton = ({
  onClick,
  isExpanded,
}: UserMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted/30 flex items-center space-x-2 rounded-lg bg-transparent px-4 py-2 transition-colors"
      aria-expanded={isExpanded}
      aria-haspopup="menu"
      aria-label="Menú de usuario"
    >
      <div className="from-primary to-accent flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br shadow">
        <User className="h-4 w-4 text-white" />
      </div>
    </button>
  );
};

export default UserMenuButton;
