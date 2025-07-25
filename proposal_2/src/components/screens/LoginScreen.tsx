import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Building2, Lock, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Toast } from '../common/Toast';
import { LoginData, AuthState } from '../../types';

interface LoginScreenProps {
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
  authState: AuthState;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  login,
  setPantallaActual,
  authState
}) => {
  const [formData, setFormData] = useState<LoginData>({
    usuario: '',
    contraseña: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Manejar el contador para cuenta bloqueada
  useEffect(() => {
    if (authState.bloqueado && authState.tiempoBloqueo) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((authState.tiempoBloqueo! + 120000 - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [authState.bloqueado, authState.tiempoBloqueo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authState.bloqueado) {
      setToast({ 
        type: 'warning', 
        message: `Cuenta bloqueada. Intente nuevamente en ${Math.ceil(timeRemaining / 60)} minuto(s).` 
      });
      return;
    }
    
    if (!formData.usuario.trim() || !formData.contraseña.trim()) {
      setToast({ type: 'error', message: 'Por favor complete todos los campos' });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        setToast({ type: 'success', message: result.message });
      } else {
        setToast({ type: 'error', message: result.message });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-miranda-orange-light/20 via-white to-miranda-orange-dark/20 flex flex-col safe-area-top safe-area-bottom">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Header with logo */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Logo and branding */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-miranda-orange-dark to-miranda-orange-light rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-miranda-gray-dark">MIRA MÓVIL</h1>
              <p className="text-miranda-gray-dark/70">Sistema de Gestión de Maquinaria</p>
              <div className="text-sm text-miranda-gray-dark/50">
                <p>Miranda Arquitectura</p>
              </div>
            </div>
          </div>

          {/* Login form */}
          <Card className="border-miranda-gray-light/60 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <h2 className="text-xl font-semibold text-center text-miranda-gray-dark">Iniciar Sesión</h2>
              <p className="text-sm text-miranda-gray-dark/60 text-center">
                Ingrese sus credenciales para acceder
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="usuario" className="text-miranda-gray-dark">Usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-miranda-gray-dark/40" />
                    <Input
                      id="usuario"
                      type="text"
                      value={formData.usuario}
                      onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
                      placeholder="Ingrese su usuario"
                      className="pl-10 h-12 border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark bg-white"
                      disabled={authState.bloqueado}
                      autoComplete="username"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contraseña" className="text-miranda-gray-dark">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-miranda-gray-dark/40" />
                    <Input
                      id="contraseña"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.contraseña}
                      onChange={(e) => setFormData(prev => ({ ...prev, contraseña: e.target.value }))}
                      placeholder="Ingrese su contraseña"
                      className="pl-10 pr-12 h-12 border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark bg-white"
                      disabled={authState.bloqueado}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-miranda-gray-dark/40 hover:text-miranda-orange-dark transition-colors mobile-touch-target"
                      disabled={authState.bloqueado}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {authState.bloqueado && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-destructive font-medium mb-1">Cuenta bloqueada</p>
                    <p className="text-xs text-destructive/80">
                      Tiempo restante: {formatTime(timeRemaining)}
                    </p>
                  </div>
                )}

                {authState.intentosFallidos > 0 && !authState.bloqueado && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-yellow-800">
                      Intentos restantes: {3 - authState.intentosFallidos}
                    </p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isLoading || authState.bloqueado}
                  className="w-full h-12 bg-miranda-orange-dark hover:bg-miranda-orange-dark/90 text-white font-medium transition-all duration-200 active:scale-98"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setPantallaActual('recuperar')}
                  className="text-sm text-miranda-orange-dark hover:text-miranda-orange-dark/80 font-medium transition-colors mobile-touch-target"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Demo credentials */}
          {/* <div className="bg-miranda-gray-light/30 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-miranda-gray-dark text-center mb-2">Credenciales de prueba:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/60 rounded p-2">
                <p className="font-medium text-miranda-gray-dark">Jefe de Compras:</p>
                <p className="text-miranda-gray-dark/70">Usuario: jperez</p>
                <p className="text-miranda-gray-dark/70">Contraseña: jperez</p>
              </div>
              <div className="bg-white/60 rounded p-2">
                <p className="font-medium text-miranda-gray-dark">Bodeguero:</p>
                <p className="text-miranda-gray-dark/70">Usuario: mgonzalez</p>
                <p className="text-miranda-gray-dark/70">Contraseña: mgonzalez</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="text-center text-xs text-miranda-gray-dark/50 space-y-1">
          <p>© 2024 Miranda Arquitectura</p>
          <p>Versión 1.0</p>
        </div>
      </div>
    </div>
  );
};