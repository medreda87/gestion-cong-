import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      navigate('/request');
    } else {
      setError('Email ou mot de passe incorrect');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gestion des Congés</h1>
              <p className="text-sm text-muted-foreground">OFPPT Tanger</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Accédez à votre espace personnel
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="votre.email@ofppt.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 rounded-lg border bg-muted/50 p-4">
            <p className="mb-3 text-sm font-medium">Comptes de démonstration :</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><span className="font-medium">Employé:</span> employe@ofppt.ma</p>
              <p><span className="font-medium">Responsable:</span> responsable@ofppt.ma</p>
              <p className="pt-1 text-muted-foreground/70">Mot de passe: demo123</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="hidden bg-primary lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center text-primary-foreground"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary-foreground/10 blur-3xl" />
            <Calendar className="relative mx-auto h-32 w-32" />
          </div>
          <h2 className="mt-8 text-3xl font-bold">Gérez vos congés</h2>
          <p className="mt-4 max-w-md text-lg text-primary-foreground/80">
            Plateforme moderne de gestion des demandes de congés. 
            Simple, rapide et efficace.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

