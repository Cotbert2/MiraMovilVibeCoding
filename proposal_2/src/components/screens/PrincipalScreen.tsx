import React, { useState } from 'react';
import { Users, Package, FileText, BarChart3, Truck, Building2, Clock, TrendingUp } from 'lucide-react';
import { Header } from '../common/Header';
import { BottomNavbar } from '../common/BottomNavbar';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { User } from '../../types';
import { MaquinariaScreen } from './MaquinariaScreen';
import { GestionUsuariosScreen } from './GestionUsuariosScreen';
import { InformesScreen } from './InformesScreen';

interface PrincipalScreenProps {
  authState: { user: User | null };
  setPantallaActual: (pantalla: any) => void;
  logout: () => void;
}

interface ModuloOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pantalla: string;
  roles: string[];
  color: string;
  badge?: string;
}

const MODULOS: ModuloOption[] = [
  // {
  //   id: 'usuarios',
  //   title: 'Gestión de Usuarios',
  //   description: 'Crear, editar y eliminar usuarios',
  //   icon: <Users className="h-6 w-6" />,
  //   pantalla: 'gestionUsuarios',
  //   roles: ['Jefe de Compras'],
  //   color: 'bg-miranda-orange-dark',
  //   badge: 'Admin'
  // },
    {
    id: 'informes',
    title: 'Generar Informes',
    description: 'Crear reportes filtrados',
    icon: <BarChart3 className="h-6 w-6" />,
    pantalla: 'generarInforme',
    roles: ['Jefe de Compras'],
    color: 'bg-miranda-gray-dark',
    badge: 'Admin'
  },
  // {
  //   id: 'maquinaria',
  //   title: 'Registrar Maquinaria',
  //   description: 'Agregar nueva maquinaria',
  //   icon: <Package className="h-6 w-6" />,
  //   pantalla: 'registrarMaquinaria',
  //   roles: ['Jefe de Compras', 'Bodeguero'],
  //   color: 'bg-miranda-orange-light'
  // },
  {
    id: 'movimientos',
    title: 'Registrar Movimiento',
    description: 'Entrada o salida de maquinaria',
    icon: <Truck className="h-6 w-6" />,
    pantalla: 'registrarMovimiento',
    roles: ['Jefe de Compras', 'Bodeguero'],
    color: 'bg-miranda-orange-dark'
  },
  //TODO: propuesta 2
  {
    id: 'consultas',
    title: 'Consultar Registros',
    description: 'Ver historial de movimientos',
    icon: <FileText className="h-6 w-6" />,
    pantalla: 'consultarRegistros',
    roles: ['Jefe de Compras'],
    color: 'bg-miranda-orange-light'
  }
];

const STATS_MOCK = [
  { label: 'Maquinaria Total', value: '42', icon: Package, color: 'text-miranda-orange-dark' },
  { label: 'En Uso', value: '28', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Disponible', value: '14', icon: Clock, color: 'text-blue-600' }
];

export const PrincipalScreen: React.FC<PrincipalScreenProps> = ({
  authState,
  setPantallaActual,
  logout
}) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'maquinaria' | 'usuarios' | 'informes'>('inicio');
  const user = authState.user;
  
  if (!user) {
    return null;
  }

  const handleTabChange = (tab: 'inicio' | 'maquinaria' | 'usuarios' | 'informes') => {
    setActiveTab(tab);
  };

  const modulosDisponibles = MODULOS.filter(modulo => 
    modulo.roles.includes(user.rol)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="flex-1 overflow-auto pb-24">
            <div className="px-4 py-6 space-y-6">
              {/* Welcome Card */}
              <Card className="border-0 bg-gradient-to-br from-miranda-orange-dark to-miranda-orange-light text-white shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Bienvenido</h2>
                        <p className="text-white/90 text-sm">{user.nombre} {user.apellido}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                      {user.rol}
                    </Badge>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white/80 text-sm mb-1">Miranda Arquitectura</p>
                    <p className="text-white font-medium">Sistema de Gestión de Maquinaria</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                {STATS_MOCK.map((stat, index) => (
                  <Card key={index} className="border-miranda-gray-light">
                    <CardContent className="p-4 text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}>
                        <stat.icon className="h-full w-full" />
                      </div>
                      <p className="text-xl font-bold text-miranda-gray-dark">{stat.value}</p>
                      <p className="text-xs text-miranda-gray-dark/60 leading-tight">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-miranda-gray-dark">Accesos Rápidos</h3>
                  <div className="w-2 h-2 bg-miranda-orange-light rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  {modulosDisponibles.map((modulo) => (
                    <Card
                      key={modulo.id}
                      className="cursor-pointer border-miranda-gray-light hover:border-miranda-orange-light transition-all duration-200 active:scale-98 shadow-sm hover:shadow-md"
                      onClick={() => setPantallaActual(modulo.pantalla)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${modulo.color} rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                            {modulo.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-miranda-gray-dark truncate">{modulo.title}</h4>
                              {modulo.badge && (
                                <Badge variant="outline" className="text-xs border-miranda-orange-light text-miranda-orange-dark">
                                  {modulo.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-miranda-gray-dark/70 line-clamp-2">
                              {modulo.description}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-miranda-orange-light rounded-full flex-shrink-0"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Footer Info */}

            </div>
          </div>
        );
      case 'maquinaria':
        return <MaquinariaScreen authState={authState} setPantallaActual={setPantallaActual} />;
      case 'usuarios':
        return <GestionUsuariosScreen setPantallaActual={setPantallaActual} />;
      case 'informes':
        return <InformesScreen authState={authState} setPantallaActual={setPantallaActual} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-miranda-gray-light/20 flex flex-col safe-area-top safe-area-bottom">
      <Header
        title="MIRA MÓVIL"
        showLogoutButton={true}
        onLogout={logout}
      />
      
      {renderContent()}
      
      <BottomNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={user.rol}
      />
    </div>
  );
};