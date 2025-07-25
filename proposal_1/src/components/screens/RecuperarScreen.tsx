import React, { useState } from 'react';
import { ArrowLeft, Mail, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Toast } from '../common/Toast';
import { RecuperarData } from '../../types';
import { validarEmail } from '../../utils/validations';

interface RecuperarScreenProps {
  recuperarContraseña: (data: RecuperarData) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
}

export const RecuperarScreen: React.FC<RecuperarScreenProps> = ({
  recuperarContraseña,
  setPantallaActual
}) => {
  const [formData, setFormData] = useState<RecuperarData>({
    correo: ''
  });
  const [errors, setErrors] = useState<Partial<RecuperarData>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [enviado, setEnviado] = useState(false);

  const validateField = (field: keyof RecuperarData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'correo':
        if (!value.trim()) {
          newErrors.correo = 'El correo electrónico es obligatorio';
        } else if (!validarEmail(value)) {
          newErrors.correo = 'Formato de correo electrónico inválido';
        } else {
          delete newErrors.correo;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof RecuperarData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    validateField('correo', formData.correo);
    
    if (Object.keys(errors).length > 0 || !formData.correo.trim()) {
      setToast({ type: 'error', message: 'Por favor ingrese un correo electrónico válido' });
      return;
    }

    const result = await recuperarContraseña(formData);
    
    if (result.success) {
      setEnviado(true);
      setToast({ type: 'success', message: result.message });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-miranda-orange-light/20 to-miranda-orange-dark/20">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
        
        <Card className="w-full max-w-sm shadow-xl border-miranda-gray-light">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-miranda-gray-dark">Correo Enviado</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-miranda-gray-dark/70">
              Se ha enviado un enlace de recuperación a su correo electrónico. 
              Revise su bandeja de entrada y siga las instrucciones.
            </p>
            
            <Button
              onClick={() => setPantallaActual('login')}
              className="w-full bg-miranda-orange-dark hover:bg-miranda-orange-dark/90 text-white"
            >
              Volver al Inicio de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-miranda-orange-light/20 to-miranda-orange-dark/20">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <Card className="w-full max-w-sm shadow-xl border-miranda-gray-light">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPantallaActual('login')}
            className="w-fit mb-4 text-miranda-gray-dark hover:text-miranda-orange-dark hover:bg-miranda-orange-light/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-miranda-orange-dark to-miranda-orange-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="flex items-center justify-center">
                <Building2 className="text-white text-xl" />
                <span className="text-white text-lg font-bold ml-1">M</span>
              </div>
            </div>
            <CardTitle className="text-xl text-miranda-gray-dark">Recuperar Contraseña</CardTitle>
            <p className="text-miranda-gray-dark/70 mt-2">
              Ingrese su correo electrónico para recibir instrucciones de recuperación
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correo" className="text-miranda-gray-dark">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                placeholder="ejemplo@empresa.com"
                className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.correo ? 'border-destructive' : ''}`}
              />
              {errors.correo && (
                <p className="text-sm text-destructive">{errors.correo}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-miranda-orange-dark hover:bg-miranda-orange-dark/90 text-white"
            >
              Enviar Enlace de Recuperación
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};