import React, { useState } from 'react';
import { Header } from '../common/Header';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Toast } from '../common/Toast';
import { Maquinaria, Movimiento } from '../../types';

interface RegistrarMovimientoScreenProps {
  maquinaria: Maquinaria[];
  registrarMovimiento: (data: Omit<Movimiento, 'id' | 'fecha' | 'usuario' | 'maquinariaNombre'>) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
}

const OBRAS_DISPONIBLES = [
  'Proyecto Norte',
  'Proyecto Sur',
  'Proyecto Este',
  'Proyecto Oeste',
  'Proyecto Centro',
  'Obra Residencial A',
  'Obra Comercial B',
  'Infraestructura Vial C'
];

export const RegistrarMovimientoScreen: React.FC<RegistrarMovimientoScreenProps> = ({
  maquinaria,
  registrarMovimiento,
  setPantallaActual
}) => {
  const [formData, setFormData] = useState({
    maquinariaId: '',
    tipoMovimiento: '' as 'Entrada' | 'Salida' | '',
    obra: '',
    observaciones: ''
  });
  
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const validateField = (field: keyof typeof formData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'maquinariaId':
        if (!value) {
          newErrors.maquinariaId = 'Debe seleccionar una maquinaria';
        } else {
          delete newErrors.maquinariaId;
        }
        break;
      case 'tipoMovimiento':
        if (!value) {
          newErrors.tipoMovimiento = 'Debe seleccionar un tipo de movimiento';
        } else {
          delete newErrors.tipoMovimiento;
        }
        break;
      case 'obra':
        if (!value) {
          newErrors.obra = 'Debe seleccionar una obra';
        } else {
          delete newErrors.obra;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    validateField('maquinariaId', formData.maquinariaId);
    validateField('tipoMovimiento', formData.tipoMovimiento);
    validateField('obra', formData.obra);
    
    if (Object.keys(errors).length > 0 || !formData.maquinariaId || !formData.tipoMovimiento || !formData.obra) {
      setToast({ type: 'error', message: 'Por favor complete todos los campos obligatorios' });
      return;
    }

    const movimientoData = {
      maquinariaId: formData.maquinariaId,
      tipoMovimiento: formData.tipoMovimiento as 'Entrada' | 'Salida',
      obra: formData.obra,
      observaciones: formData.observaciones
    };

    const result = await registrarMovimiento(movimientoData);
    
    if (result.success) {
      setToast({ type: 'success', message: result.message });
      // Limpiar formulario después de éxito
      setTimeout(() => {
        setFormData({
          maquinariaId: '',
          tipoMovimiento: '',
          obra: '',
          observaciones: ''
        });
        setPantallaActual('principal');
      }, 2000);
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  if (maquinaria.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Registrar Movimiento"
          showBackButton={true}
          onBack={() => setPantallaActual('principal')}
        />
        
        <div className="p-4 flex items-center justify-center min-h-96">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No hay maquinaria registrada</h3>
              <p className="text-muted-foreground mb-4">
                Debe registrar maquinaria antes de poder registrar movimientos.
              </p>
              <Button onClick={() => setPantallaActual('registrarMaquinaria')}>
                Registrar Maquinaria
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <Header
        title="Registrar Movimiento"
        showBackButton={true}
        onBack={() => setPantallaActual('principal')}
      />
      
      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maquinaria">Maquinaria</Label>
                <Select
                  value={formData.maquinariaId}
                  onValueChange={(value) => handleInputChange('maquinariaId', value)}
                >
                  <SelectTrigger className={errors.maquinariaId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Seleccione la maquinaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {maquinaria.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.codigo} - {item.tipo} {item.marca} {item.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.maquinariaId && (
                  <p className="text-xs text-destructive">{errors.maquinariaId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipoMovimiento">Tipo de Movimiento</Label>
                <Select
                  value={formData.tipoMovimiento}
                  onValueChange={(value) => handleInputChange('tipoMovimiento', value)}
                >
                  <SelectTrigger className={errors.tipoMovimiento ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Seleccione el tipo de movimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoMovimiento && (
                  <p className="text-xs text-destructive">{errors.tipoMovimiento}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obra">Obra</Label>
                   <Textarea
                  type="text"
                  id="obra"
                  value={formData.obra}
                  onChange={(e) => handleInputChange('obra', e.target.value)}
                  placeholder="Ingrese el nombre de la obra"
                  className={`input input-bordered w-full ${errors.obra ? 'border-destructive' : ''}`}
                />
                {errors.obra && (
                  <p className="text-xs text-destructive">{errors.obra}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Detalles adicionales del movimiento..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPantallaActual('principal')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Registrar Movimiento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};