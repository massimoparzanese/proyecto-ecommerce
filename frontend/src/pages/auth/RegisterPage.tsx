import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ShoppingCart, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import apiFetch, { ApiError } from '@/utils/api';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (loading) return; // Prevenir doble submit

    setLoading(true);

    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      // El backend devuelve: { message: string, data: { id, name, email, role } }
      if (!result.data || !result.data.id || !result.data.role) {
        throw new Error('Respuesta del servidor incompleta');
      }

      const { id, name: userName, role } = result.data;

      // Guardar en Redux (el token va en cookie httpOnly)
      dispatch(
        setCredentials({
          user: { id, name: userName, role: role as 'user' | 'admin' },
          token: null, // El token va en cookie httpOnly
        })
      );

      toast.success('¡Registro exitoso!');

      // Redirigir según el rol
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error('Register error:', error);

      if (error instanceof ApiError) {
        // Manejar errores de validación del backend
        let errorMsg = error.message;

        // Si hay datos adicionales (como reasons de validación)
        if (error.data?.reasons && Array.isArray(error.data.reasons)) {
          errorMsg = error.data.reasons.join('. ');
        }

        toast.error(errorMsg);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al registrar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-secondary/10 via-accent/10 to-primary/10 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="from-secondary to-accent flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <section className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </section>
            <section className="space-y-2">
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
            </section>
            <section className="space-y-2">
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
            </section>
            <section className="space-y-2 pb-5">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="from-secondary to-accent w-full bg-linear-to-r transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
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
