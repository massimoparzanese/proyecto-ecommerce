import { Loader2 } from 'lucide-react';
import type { AuthLoadingProps } from '@/interfaces/auth';

/**
 * Componente de loading para mostrar durante la verificación de autenticación
 */
export const AuthLoading = ({
  message = 'Verificando autenticación...',
}: AuthLoadingProps) => {
  return (
    <div className="from-primary/5 via-background to-accent/5 flex min-h-screen items-center justify-center bg-linear-to-br">
      <div className="text-center">
        <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4">{message}</p>
      </div>
    </div>
  );
};

export default AuthLoading;
