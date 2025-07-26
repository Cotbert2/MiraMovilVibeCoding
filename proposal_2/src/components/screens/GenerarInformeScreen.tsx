import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Header } from '../common/Header';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Toast } from '../common/Toast';
import { Movimiento, FiltrosInforme } from '../../types';

interface GenerarInformeScreenProps {
  movimientos: Movimiento[];
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

const TIPOS_MAQUINARIA = [
  'Excavadora',
  'Grúa',
  'Bulldozer',
  'Retroexcavadora',
  'Cargadora',
  'Compactadora',
  'Motoniveladora',
  'Camión Volquete',
  'Montacargas'
];

export const GenerarInformeScreen: React.FC<GenerarInformeScreenProps> = ({
  movimientos,
  setPantallaActual
}) => {
  const [filtros, setFiltros] = useState<FiltrosInforme>({
    fechaInicio: '',
    fechaFin: '',
    obra: '__all__',
    tipoMaquinaria: '__all__'
  });
  const [errors, setErrors] = useState<Partial<FiltrosInforme>>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const validateField = (field: keyof FiltrosInforme, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'fechaInicio':
        if (!value) {
          newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
        } else if (filtros.fechaFin && value > filtros.fechaFin) {
          newErrors.fechaInicio = 'La fecha de inicio no puede ser mayor a la fecha fin';
        } else {
          delete newErrors.fechaInicio;
          if (filtros.fechaFin && value <= filtros.fechaFin) {
            delete newErrors.fechaFin;
          }
        }
        break;
      case 'fechaFin':
        if (!value) {
          newErrors.fechaFin = 'La fecha de fin es obligatoria';
        } else if (filtros.fechaInicio && value < filtros.fechaInicio) {
          newErrors.fechaFin = 'La fecha de fin no puede ser menor a la fecha inicio';
        } else {
          delete newErrors.fechaFin;
          if (filtros.fechaInicio && value >= filtros.fechaInicio) {
            delete newErrors.fechaInicio;
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof FiltrosInforme, value: string) => {
    setFiltros(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const aplicarFiltros = (movimientos: Movimiento[]): Movimiento[] => {
    return movimientos.filter(movimiento => {
      const fechaMovimiento = movimiento.fecha;
      const dentroRangoFecha = fechaMovimiento >= filtros.fechaInicio && fechaMovimiento <= filtros.fechaFin;
      const coincideObra = !filtros.obra || filtros.obra === '__all__' || movimiento.obra === filtros.obra;
      const coincideTipo = !filtros.tipoMaquinaria || filtros.tipoMaquinaria === '__all__' || movimiento.maquinariaNombre.toLowerCase().includes(filtros.tipoMaquinaria.toLowerCase());
      
      return dentroRangoFecha && coincideObra && coincideTipo;
    });
  };

  const handleGenerarInforme = () => {
    // Validar fechas obligatorias
    validateField('fechaInicio', filtros.fechaInicio);
    validateField('fechaFin', filtros.fechaFin);
    
    if (Object.keys(errors).length > 0 || !filtros.fechaInicio || !filtros.fechaFin) {
      setToast({ type: 'error', message: 'Por favor complete las fechas de inicio y fin' });
      return;
    }

    setMostrarResultados(true);
    setToast({ type: 'success', message: 'Informe generado exitosamente' });
  };

  const handleExportarInforme = () => {
    const resultados = aplicarFiltros(movimientos);
    
    if (resultados.length === 0) {
      setToast({ type: 'warning', message: 'No hay datos disponibles para exportar con los filtros seleccionados' });
      return;
    }

    // Simular exportación
    const nombreArchivo = `Informe_Movimientos_${filtros.fechaInicio}_${filtros.fechaFin}.pdf`;
    setToast({ type: 'success', message: `Informe exportado como ${nombreArchivo}` });
  };

  const resultados = mostrarResultados ? aplicarFiltros(movimientos) : [];

  const obtenerEstadisticas = (movimientos: Movimiento[]) => {
    const entradas = movimientos.filter(m => m.tipoMovimiento === 'Entrada').length;
    const salidas = movimientos.filter(m => m.tipoMovimiento === 'Salida').length;
    const obras = new Set(movimientos.map(m => m.obra)).size;
    
    return { entradas, salidas, obras, total: movimientos.length };
  };

  const estadisticas = obtenerEstadisticas(resultados);

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
        title="Generar Informe"
        showBackButton={true}
        onBack={() => setPantallaActual('principal')}
      />
      
      <div className="p-4 space-y-4">
        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros del Informe</span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio" className="text-xs">Fecha Inicio *</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    className={errors.fechaInicio ? 'border-destructive' : ''}
                  />
                  {errors.fechaInicio && (
                    <p className="text-xs text-destructive">{errors.fechaInicio}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fechaFin" className="text-xs">Fecha Fin *</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    className={errors.fechaFin ? 'border-destructive' : ''}
                  />
                  {errors.fechaFin && (
                    <p className="text-xs text-destructive">{errors.fechaFin}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Obra Específica (Opcional)</Label>
                <Select
                  value={filtros.obra}
                  onValueChange={(value: string) => handleInputChange('obra', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las obras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todas las obras</SelectItem>
                    {OBRAS_DISPONIBLES.map((obra) => (
                      <SelectItem key={obra} value={obra}>
                        {obra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Tipo de Maquinaria (Opcional)</Label>
                <Select
                  value={filtros.tipoMaquinaria}
                  onValueChange={(value: string) => handleInputChange('tipoMaquinaria', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todos los tipos</SelectItem>
                    {TIPOS_MAQUINARIA.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleGenerarInforme}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar Informe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {mostrarResultados && (
          <>
            {/* Estadísticas */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Resumen Estadístico</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{estadisticas.total}</div>
                    <div className="text-sm text-muted-foreground">Total Movimientos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.entradas}</div>
                    <div className="text-sm text-muted-foreground">Entradas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{estadisticas.salidas}</div>
                    <div className="text-sm text-muted-foreground">Salidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.obras}</div>
                    <div className="text-sm text-muted-foreground">Obras Involucradas</div>
                  </div>
                </div>
                
                <Button
                  onClick={handleExportarInforme}
                  className="w-full mt-4"
                  variant="outline"
                  disabled={resultados.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a PDF
                </Button>
              </CardContent>
            </Card>

            {/* Lista de movimientos */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Detalle de Movimientos</h3>
                
                {resultados.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No se encontraron movimientos en el rango de fechas seleccionado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resultados.map((movimiento) => (
                      <div key={movimiento.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{movimiento.maquinariaNombre}</h4>
                          <Badge variant={movimiento.tipoMovimiento === 'Entrada' ? 'default' : 'secondary'}>
                            {movimiento.tipoMovimiento}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{movimiento.fecha}</span>
                          </div>
                          <div>Obra: <strong>{movimiento.obra}</strong></div>
                          <div>Usuario: {movimiento.usuario}</div>
                          {movimiento.observaciones && (
                            <div>Observaciones: {movimiento.observaciones}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};