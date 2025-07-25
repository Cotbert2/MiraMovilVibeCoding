import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Header } from '../common/Header';
import { Card, CardContent } from '../ui/card';

interface GestionUsuariosScreenProps {
  setPantallaActual: (pantalla: any) => void;
}

interface OpcionGestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pantalla: string;
  color: string;
}

const OPCIONES_GESTION: OpcionGestion[] = [
  {
    id: 'crear',
    title: 'Crear Usuario',
    description: 'Registrar un nuevo usuario en el sistema',
    icon: <UserPlus className="h-6 w-6" />,
    pantalla: 'registrarUsuario',
    color: 'bg-miranda-orange-dark'
  },
  {
    id: 'listar',
    title: 'Listar Usuarios',
    description: 'Ver todos los usuarios registrados',
    icon: <Users className="h-6 w-6" />,
    pantalla: 'listarUsuarios',
    color: 'bg-miranda-orange-light'
  }
];

export const GestionUsuariosScreen: React.FC<GestionUsuariosScreenProps> = ({
  setPantallaActual
}) => {
  return (
    <div className="min-h-screen bg-miranda-gray-light/30">
      <Header
        title="Gestión de Usuarios"
        showBackButton={true}
        onBack={() => setPantallaActual('principal')}
      />
      
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-miranda-gray-dark">Opciones Disponibles</h3>
          
          <div className="grid gap-3">
            {OPCIONES_GESTION.map((opcion) => (
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