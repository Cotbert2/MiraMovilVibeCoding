import React from 'react';
import { BarChart3, Download, Search } from 'lucide-react';
import { Header } from '../common/Header';
import { Card, CardContent } from '../ui/card';
import { User } from '../../types';

interface InformesScreenProps {
  authState: { user: User | null };
  setPantallaActual: (pantalla: any) => void;
}

interface OpcionInforme {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pantalla: string;
  color: string;
}

const OPCIONES_INFORMES: OpcionInforme[] = [
  {
    id: 'consultar',
    title: 'Consultar Registros',
    description: 'Ver historial de movimientos y maquinaria',
    icon: <Search className="h-6 w-6" />,
    pantalla: 'consultarRegistros',
    color: 'bg-miranda-orange-dark'
  },
  {
    id: 'generar',
    title: 'Generar Informes',
    description: 'Crear reportes filtrados de movimientos',
    icon: <Download className="h-6 w-6" />,
    pantalla: 'generarInforme',
    color: 'bg-miranda-orange-light'
  }
];

export const InformesScreen: React.FC<InformesScreenProps> = ({
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
        title="Informes y Consultas"
        showLogoutButton={false}
      />
      
      <div className="p-4 space-y-6">
        {/* Información del módulo */}
        <div className="bg-gradient-to-r from-miranda-orange-dark to-miranda-orange-light rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Informes y Consultas</h2>
              <p className="text-white/90 text-sm">Reportes y análisis de datos</p>
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
            {OPCIONES_INFORMES.map((opcion) => (
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