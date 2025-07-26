import React, { useState } from 'react';
import { Filter, Download, Calendar, AlertTriangle } from 'lucide-react';
import { Header } from '../common/Header';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Toast } from '../common/Toast';
import { Movimiento, Maquinaria, FiltrosConsulta } from '../../types';

interface ConsultarRegistrosScreenProps {
  movimientos: Movimiento[];
  maquinaria: Maquinaria[];
  setPantallaActual: (pantalla: any) => void;
}

export const ConsultarRegistrosScreen: React.FC<ConsultarRegistrosScreenProps> = ({
  movimientos,
  setPantallaActual
}) => {
  const [filtros, setFiltros] = useState<FiltrosConsulta>({
    fecha: '',
    tipoMovimiento: undefined,
    maquinaria: '',
    estado: ''
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const aplicarFiltros = (movimientos: Movimiento[]): Movimiento[] => {
    return movimientos.filter(movimiento => {
      const coincideFecha = !filtros.fecha || movimiento.fecha === filtros.fecha;
      const coincideTipo = !filtros.tipoMovimiento || movimiento.tipoMovimiento === filtros.tipoMovimiento;
      const coincideMaquinaria = !filtros.maquinaria || movimiento.maquinariaNombre.toLowerCase().includes(filtros.maquinaria.toLowerCase());
      
      return coincideFecha && coincideTipo && coincideMaquinaria;
    });
  };

  const movimientosFiltrados = aplicarFiltros(movimientos);

  const handleExportar = () => {
    if (movimientosFiltrados.length === 0) {
      setToast({ type: 'warning', message: 'No hay datos disponibles para exportar' });
      return;
    }

    // Simular exportación
    setToast({ type: 'success', message: 'Registros exportados exitosamente' });
  };

  const getTipoMovimientoBadge = (tipo: string) => {
    return tipo === 'Entrada' ? 'default' : 'secondary';
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha: '',
      tipoMovimiento: undefined,
      maquinaria: '',
      estado: ''
    });
  };

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
        title="Consultar Registros"
        showBackButton={true}
        onBack={() => setPantallaActual('principal')}
      />
      
      <div className="p-4 space-y-4">
        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros de Búsqueda</span>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fecha" className="text-xs">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={filtros.fecha}
                    onChange={(e) => setFiltros(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Tipo de Movimiento</Label>
                  <Select
                    value={filtros.tipoMovimiento || '__all__'}
                    onValueChange={(value: string) => setFiltros(prev => ({ ...prev, tipoMovimiento: value === '__all__' ? undefined : value as 'Entrada' | 'Salida' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Todos</SelectItem>
                      <SelectItem value="Entrada">Entrada</SelectItem>
                      <SelectItem value="Salida">Salida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maquinaria" className="text-xs">Buscar Maquinaria</Label>
                <Input
                  id="maquinaria"
                  type="text"
                  value={filtros.maquinaria}
                  onChange={(e) => setFiltros(prev => ({ ...prev, maquinaria: e.target.value }))}
                  placeholder="Buscar por nombre, marca o obra"
                />
              </div>

              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={limpiarFiltros}
                  className="flex-1"
                >
                  Limpiar Filtros
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportar}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Registros ({movimientosFiltrados.length})
            </h3>
          </div>
          
          {movimientos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay registros</h3>
                <p className="text-muted-foreground mb-4">
                  Aún no se han registrado movimientos en el sistema.
                </p>
                <Button onClick={() => setPantallaActual('registrarMovimiento')}>
                  Registrar Primer Movimiento
                </Button>
              </CardContent>
            </Card>
          ) : movimientosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No se encontraron registros con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {movimientosFiltrados.map((movimiento) => (
                <Card key={movimiento.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{movimiento.maquinariaNombre}</h4>
                        <Badge variant={getTipoMovimientoBadge(movimiento.tipoMovimiento)}>
                          {movimiento.tipoMovimiento}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Fecha: {movimiento.fecha}</span>
                        </div>
                        <div>Obra: <strong>{movimiento.obra}</strong></div>
                        <div>Usuario: {movimiento.usuario}</div>
                        {movimiento.observaciones && (
                          <div>Observaciones: {movimiento.observaciones}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};