import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/card';
import { ShoppingCart, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import apiFetch, { ApiError } from '@/utils/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener la ruta desde donde fue redirigido (si existe)
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return; // Prevenir doble submit

    setLoading(true);

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      // El backend devuelve: { message: string, data: { id, name, email, role } }
      if (!result.data || !result.data.id || !result.data.role) {
        throw new Error('Respuesta del servidor incompleta');
      }

      const { id, name, role } = result.data;

      // Guardar en Redux (el token va en cookie httpOnly)
      dispatch(
        setCredentials({
          user: { id, name, role: role as 'user' | 'admin' },
          token: null, // El token va en cookie httpOnly
        })
      );

      toast.success('¡Inicio de sesión exitoso!');

      // Redirigir a la página previa o según el rol
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(role === 'admin' ? '/admin' : '/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof ApiError) {
        toast.error(error.message || 'Credenciales inválidas');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="from-primary/10 via-accent/10 to-secondary/10 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="from-primary to-accent flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 pb-5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="from-primary to-accent w-full bg-linear-to-r transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground text-center text-sm transition-colors"
            >
              Volver al inicio
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
