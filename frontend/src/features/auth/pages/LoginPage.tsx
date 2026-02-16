import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/card';
import { ShoppingCart, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import apiFetch from '@/utils/api';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await apiFetch('http://localhost:4000/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.ok) {
      const data = await result.json();
      toast.success('¡Inicio de sesión exitoso!');
      console.log('Login data:', data);
      const role = (data.role as 'user' | 'admin') || 'user';
      const name = data.name || email.split('@')[0];
      const id = data.id || '';
      dispatch(
        setCredentials({ user: { id, name, role }, token: data.token ?? null })
      );

      navigate(role === 'admin' ? '/admin' : '/');
    } else {
      toast.error('Credenciales inválidas');
    }
    setLoading(false);
  };
  return (
    <div className="from-primary/10 via-accent/10 to-secondary/10 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="from-primary to-accent flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
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
              className="from-primary to-accent w-full bg-gradient-to-r transition-opacity hover:opacity-90"
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
