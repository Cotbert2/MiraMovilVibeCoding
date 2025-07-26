import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Header } from '../common/Header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Toast } from '../common/Toast';
import { RegistroUsuarioData } from '../../types';
import { validarCedula, validarEmail, validarUsuario, validarTexto } from '../../utils/validations';

interface RegistrarUsuarioScreenProps {
  registrarUsuario: (data: RegistroUsuarioData) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
}

export const RegistrarUsuarioScreen: React.FC<RegistrarUsuarioScreenProps> = ({
  registrarUsuario,
  setPantallaActual
}) => {
  const [formData, setFormData] = useState<RegistroUsuarioData>({
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    rol: 'Bodeguero',
    usuario: '',
    contraseña: ''
  });
  
  const [errors, setErrors] = useState<Partial<RegistroUsuarioData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const validateField = (field: keyof RegistroUsuarioData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nombre':
      case 'apellido':
        if (!validarTexto(value)) {
          newErrors[field] = `${field === 'nombre' ? 'El nombre' : 'El apellido'} es obligatorio`;
        } else {
          delete newErrors[field];
        }
        break;
      case 'cedula':
        if (!value.trim()) {
          newErrors.cedula = 'La cédula es obligatoria';
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.cedula = 'La cédula debe tener exactamente 10 dígitos';
        } else if (!validarCedula(value)) {
          newErrors.cedula = 'Cédula inválida. Verifique el dígito verificador';
        } else {
          delete newErrors.cedula;
        }
        break;
      case 'correo':
        if (!value.trim()) {
          newErrors.correo = 'El correo electrónico es obligatorio';
        } else if (!validarEmail(value)) {
          newErrors.correo = 'Formato de correo electrónico inválido';
        } else {
          delete newErrors.correo;
        }
        break;
      case 'usuario':
        if (!value.trim()) {
          newErrors.usuario = 'El nombre de usuario es obligatorio';
        } else if (!validarUsuario(value)) {
          newErrors.usuario = 'El usuario debe tener al menos 3 caracteres alfanuméricos';
        } else {
          delete newErrors.usuario;
        }
        break;
      case 'contraseña':
        if (!value.trim()) {
          newErrors.contraseña = 'La contraseña es obligatoria';
        } else if (value.length < 6) {
          newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete newErrors.contraseña;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof RegistroUsuarioData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    Object.keys(formData).forEach(key => {
      validateField(key as keyof RegistroUsuarioData, formData[key as keyof RegistroUsuarioData]);
    });
    
    if (Object.keys(errors).length > 0) {
      setToast({ type: 'error', message: 'Por favor corrija los errores en el formulario' });
      return;
    }

    const result = await registrarUsuario(formData);
    
    if (result.success) {
      setToast({ type: 'success', message: result.message });
      // Limpiar formulario después de éxito
      setTimeout(() => {
        setFormData({
          nombre: '',
          apellido: '',
          cedula: '',
          correo: '',
          rol: 'Bodeguero',
          usuario: '',
          contraseña: ''
        });
        setPantallaActual('gestionUsuarios');
      }, 2000);
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  const handleCancel = () => {
    setPantallaActual('gestionUsuarios');
  };

  return (
    <div className="min-h-screen bg-miranda-gray-light/30">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <Header
        title="Registrar Usuario"
        showBackButton={true}
        onBack={() => setPantallaActual('gestionUsuarios')}
      />
      
      <div className="p-4">
        <Card className="border-miranda-gray-light">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-miranda-gray-dark">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Juan"
                    className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.nombre ? 'border-destructive' : ''}`}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-destructive">{errors.nombre}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-miranda-gray-dark">Apellido</Label>
                  <Input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Pérez"
                    className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.apellido ? 'border-destructive' : ''}`}
                  />
                  {errors.apellido && (
                    <p className="text-xs text-destructive">{errors.apellido}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cedula" className="text-miranda-gray-dark">Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="1234567890"
                  className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.cedula ? 'border-destructive' : ''}`}
                  maxLength={10}
                />
                {errors.cedula && (
                  <p className="text-xs text-destructive">{errors.cedula}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="correo" className="text-miranda-gray-dark">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                  placeholder="usuario@empresa.com"
                  className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.correo ? 'border-destructive' : ''}`}
                />
                {errors.correo && (
                  <p className="text-xs text-destructive">{errors.correo}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rol" className="text-miranda-gray-dark">Rol</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value: 'Jefe de Compras' | 'Bodeguero') => handleInputChange('rol', value)}
                >
                  <SelectTrigger className="border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                    <SelectItem value="Jefe de Compras">Jefe de Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-miranda-gray-dark">Usuario</Label>
                <Input
                  id="usuario"
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => handleInputChange('usuario', e.target.value)}
                  placeholder="usuario123"
                  className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.usuario ? 'border-destructive' : ''}`}
                />
                {errors.usuario && (
                  <p className="text-xs text-destructive">{errors.usuario}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contraseña" className="text-miranda-gray-dark">Contraseña Temporal</Label>
                <div className="relative">
                  <Input
                    id="contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.contraseña}
                    onChange={(e) => handleInputChange('contraseña', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark pr-10 ${errors.contraseña ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-miranda-gray-dark hover:text-miranda-orange-dark"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.contraseña && (
                  <p className="text-xs text-destructive">{errors.contraseña}</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-miranda-gray-light text-miranda-gray-dark hover:bg-miranda-gray-light"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-miranda-orange-dark hover:bg-miranda-orange-dark/90 text-white"
                >
                  Crear Usuario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};