import React, { useState } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Toast } from '../common/Toast';
import { BottomNavbar } from '../common/BottomNavbar';
import { Maquinaria, User } from '../../types';
import { validarCampoRequerido, validarSoloNumeros } from '../../utils/validations';

interface RegistrarMaquinariaScreenProps {
  registrarMaquinaria: (data: Omit<Maquinaria, 'id' | 'fechaRegistro'>) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
  authState: { user: User | null };
}

const TIPOS_MAQUINARIA = [
  'Excavadora',
  'Bulldozer',
  'Grúa',
  'Retroexcavadora',
  'Cargador Frontal',
  'Compactadora',
  'Motoniveladora',
  'Volquete',
  'Mixer',
  'Otros'
];

const ESTADOS_MAQUINARIA = [
  'Nuevo',
  'Usado - Excelente',
  'Usado - Bueno',
  'Usado - Regular',
  'Requiere Mantenimiento'
];

export const RegistrarMaquinariaScreen: React.FC<RegistrarMaquinariaScreenProps> = ({
  registrarMaquinaria,
  setPantallaActual,
  authState
}) => {
  const [formData, setFormData] = useState<Omit<Maquinaria, 'id' | 'fechaRegistro'>>({
    codigo: '',
    nombre: '',
    tipo: '',
    marca: '',
    modelo: '',
    año: 0,
    numeroSerie: '',
    estado: '',
    ubicacionActual: '',
    descripcion: '',
    valorCompra: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const validateField = (field: keyof typeof formData, value: any) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'codigo':
      case 'nombre':
      case 'marca':
      case 'modelo':
      case 'numeroSerie':
      case 'ubicacionActual':
        if (!validarCampoRequerido(value)) {
          newErrors[field] = 'Este campo es obligatorio';
        } else {
          delete newErrors[field];
        }
        break;
      case 'tipo':
      case 'estado':
        if (!validarCampoRequerido(value)) {
          newErrors[field] = 'Debe seleccionar una opción';
        } else {
          delete newErrors[field];
        }
        break;
      case 'año':
        if (!value || value <= 0) {
          newErrors[field] = 'El año es obligatorio y debe ser válido';
        } else if (value < 1900 || value > new Date().getFullYear() + 1) {
          newErrors[field] = 'El año debe estar entre 1900 y ' + (new Date().getFullYear() + 1);
        } else {
          delete newErrors[field];
        }
        break;
      case 'valorCompra':
        if (value < 0) {
          newErrors[field] = 'El valor no puede ser negativo';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos obligatorios
    const requiredFields: (keyof typeof formData)[] = [
      'codigo', 'nombre', 'tipo', 'marca', 'modelo', 'año', 'numeroSerie', 'estado', 'ubicacionActual'
    ];
    
    requiredFields.forEach(field => {
      validateField(field, formData[field]);
    });
    
    if (Object.keys(errors).length > 0) {
      setToast({ type: 'error', message: 'Por favor complete todos los campos obligatorios correctamente' });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await registrarMaquinaria(formData);
      
      if (result.success) {
        setToast({ type: 'success', message: result.message });
        // Limpiar formulario después de registro exitoso
        setTimeout(() => {
          setFormData({
            codigo: '',
            nombre: '',
            tipo: '',
            marca: '',
            modelo: '',
            año: 0,
            numeroSerie: '',
            estado: '',
            ubicacionActual: '',
            descripcion: '',
            valorCompra: 0
          });
        }, 1500);
      } else {
        setToast({ type: 'error', message: result.message });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Error al registrar la maquinaria' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-miranda-gray-light/30 flex flex-col">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-24">
          <Card className="border-miranda-gray-light">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPantallaActual('principal')}
                  className="text-miranda-gray-dark hover:text-miranda-orange-dark hover:bg-miranda-orange-light/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-miranda-orange-dark rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-miranda-gray-dark">Registrar Maquinaria</CardTitle>
                  <p className="text-miranda-gray-dark/70 mt-1">Complete la información de la nueva maquinaria</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-miranda-gray-dark">Código *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => handleInputChange('codigo', e.target.value)}
                      placeholder="Ej: MAQ-001"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.codigo ? 'border-destructive' : ''}`}
                    />
                    {errors.codigo && <p className="text-sm text-destructive">{errors.codigo}</p>}
                  </div>
                  
                  {/* <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-miranda-gray-dark">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Nombre de la maquinaria"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.nombre ? 'border-destructive' : ''}`}
                    />
                    {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                  </div> */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="text-miranda-gray-dark">Tipo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                      <SelectTrigger className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.tipo ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_MAQUINARIA.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipo && <p className="text-sm text-destructive">{errors.tipo}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marca" className="text-miranda-gray-dark">Marca *</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => handleInputChange('marca', e.target.value)}
                      placeholder="Marca de la maquinaria"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.marca ? 'border-destructive' : ''}`}
                    />
                    {errors.marca && <p className="text-sm text-destructive">{errors.marca}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelo" className="text-miranda-gray-dark">Modelo *</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => handleInputChange('modelo', e.target.value)}
                      placeholder="Modelo de la maquinaria"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.modelo ? 'border-destructive' : ''}`}
                    />
                    {errors.modelo && <p className="text-sm text-destructive">{errors.modelo}</p>}
                  </div>
                  
                  {/* <div className="space-y-2">
                    <Label htmlFor="año" className="text-miranda-gray-dark">Año *</Label>
                    <Input
                      id="año"
                      type="number"
                      value={formData.año || ''}
                      onChange={(e) => handleInputChange('año', parseInt(e.target.value) || 0)}
                      placeholder="Año de fabricación"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.año ? 'border-destructive' : ''}`}
                    />
                    {errors.año && <p className="text-sm text-destructive">{errors.año}</p>}
                  </div> */}
                </div>
                
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroSerie" className="text-miranda-gray-dark">Número de Serie *</Label>
                    <Input
                      id="numeroSerie"
                      value={formData.numeroSerie}
                      onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                      placeholder="Número de serie"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.numeroSerie ? 'border-destructive' : ''}`}
                    />
                    {errors.numeroSerie && <p className="text-sm text-destructive">{errors.numeroSerie}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-miranda-gray-dark">Estado *</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                      <SelectTrigger className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.estado ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Seleccione el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS_MAQUINARIA.map((estado) => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.estado && <p className="text-sm text-destructive">{errors.estado}</p>}
                  </div>
                </div> */}
                
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacionActual" className="text-miranda-gray-dark">Ubicación Actual *</Label>
                    <Input
                      id="ubicacionActual"
                      value={formData.ubicacionActual}
                      onChange={(e) => handleInputChange('ubicacionActual', e.target.value)}
                      placeholder="Ubicación actual"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.ubicacionActual ? 'border-destructive' : ''}`}
                    />
                    {errors.ubicacionActual && <p className="text-sm text-destructive">{errors.ubicacionActual}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valorCompra" className="text-miranda-gray-dark">Valor de Compra (USD)</Label>
                    <Input
                      id="valorCompra"
                      type="number"
                      value={formData.valorCompra || ''}
                      onChange={(e) => handleInputChange('valorCompra', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark ${errors.valorCompra ? 'border-destructive' : ''}`}
                    />
                    {errors.valorCompra && <p className="text-sm text-destructive">{errors.valorCompra}</p>}
                  </div>
                </div> */}
                
                {/* <div className="space-y-2">
                  <Label htmlFor="descripcion" className="text-miranda-gray-dark">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Descripción adicional de la maquinaria"
                    rows={3}
                    className="border-miranda-gray-light focus:border-miranda-orange-dark focus:ring-miranda-orange-dark"
                  />
                </div> */}
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-miranda-orange-dark hover:bg-miranda-orange-dark/90 text-white"
                >
                  {isLoading ? 'Registrando...' : 'Registrar Maquinaria'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNavbar
          activeTab="maquinaria"
          onTabChange={(tab) => {
            if (tab === 'inicio') setPantallaActual('principal');
            else if (tab === 'usuarios') setPantallaActual('gestionUsuarios');
            else if (tab === 'informes') setPantallaActual('consultarRegistros');
          }}
          userRole={authState.user?.rol || ''}
        />
      </div>
    </div>
  );
};