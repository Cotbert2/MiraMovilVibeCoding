import React from 'react';
import { Package, Truck, FileText, Plus } from 'lucide-react';
import { Header } from '../common/Header';
import { Card, CardContent } from '../ui/card';
import { User } from '../../types';

interface MaquinariaScreenProps {
  authState: { user: User | null };
  setPantallaActual: (pantalla: any) => void;
}

interface OpcionMaquinaria {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pantalla: string;
  color: string;
}

const OPCIONES_MAQUINARIA: OpcionMaquinaria[] = [
  {
    id: 'registrar',
    title: 'Registrar Maquinaria',
    description: 'Agregar nueva maquinaria al inventario',
    icon: <Plus className="h-6 w-6" />,
    pantalla: 'registrarMaquinaria',
    color: 'bg-miranda-orange-dark'
  },
  {
    id: 'movimientos',
    title: 'Registrar Movimiento',
    description: 'Registrar entrada o salida de maquinaria',
    icon: <Truck className="h-6 w-6" />,
    pantalla: 'registrarMovimiento',
    color: 'bg-miranda-orange-light'
  },
  {
    id: 'consultar',
    title: 'Consultar Registros',
    description: 'Ver historial de movimientos y maquinaria',
    icon: <FileText className="h-6 w-6" />,
    pantalla: 'consultarRegistros',
    color: 'bg-miranda-gray-dark'
  }
];

export const MaquinariaScreen: React.FC<MaquinariaScreenProps> = ({
  authState,
  setPantallaActual
}) => {
  const user = authState.user;
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-miranda-gray-light/30 pb-20">
      <Header
        title="Gestión de Maquinaria"
        showLogoutButton={false}
      />
      
      <div className="p-4 space-y-6">
        {/* Información del módulo */}
        <div className="bg-gradient-to-r from-miranda-orange-dark to-miranda-orange-light rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Gestión de Maquinaria</h2>
              <p className="text-white/90 text-sm">Registro y control de equipos</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-white/80 mb-1">Usuario activo</p>
            <p className="text-sm">{user.nombre} {user.apellido} - {user.rol}</p>
          </div>
        </div>
        
        {/* Opciones disponibles */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-miranda-gray-dark">Opciones Disponibles</h3>
          
          <div className="grid gap-3">
            {OPCIONES_MAQUINARIA.map((opcion) => (
              <Card
                key={opcion.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 border-miranda-gray-light hover:border-miranda-orange-light"
                onClick={() => setPantallaActual(opcion.pantalla)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${opcion.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                      {opcion.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 text-miranda-gray-dark">{opcion.title}</h4>
                      <p className="text-sm text-miranda-gray-dark/70">
                        {opcion.description}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-miranda-orange-light rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};