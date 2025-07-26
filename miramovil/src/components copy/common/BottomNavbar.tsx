import React from 'react';
import { User } from '../../types';

interface BottomNavbarProps {
  activeTab: 'inicio' | 'maquinaria' | 'usuarios' | 'informes';
  onTabChange: (tab: 'inicio' | 'maquinaria' | 'usuarios' | 'informes') => void;
  userRole?: string;
}

interface NavItem {
  id: 'inicio' | 'maquinaria' | 'usuarios' | 'informes';
  label: string;
  icon: React.ReactNode;
  allowedRoles: string[];
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onTabChange,
  userRole = ''
}) => {
  const navItems: NavItem[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      allowedRoles: ['Jefe de Compras', 'Bodeguero'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.10Z"></path>
        </svg>
      )
    },
    {
      id: 'maquinaria',
      label: 'Maquinaria',
      allowedRoles: ['Jefe de Compras', 'Bodeguero'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M247.43,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,247.43,117ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208ZM24,136V72H168v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm0-96V88h34.58l9.6,24Z"></path>
        </svg>
      )
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      allowedRoles: ['Jefe de Compras'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
      )
    },
    {
      id: 'informes',
      label: 'Informes',
      allowedRoles: ['Jefe de Compras', 'Bodeguero'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
        </svg>
      )
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="bg-white border-t border-miranda-gray-light/60 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95">
        <div className="grid auto-cols-fr grid-flow-col px-2 py-1">
          {filteredNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 py-3 px-3 transition-all duration-200 rounded-xl m-1 mobile-touch-target ${
                  isActive 
                    ? 'text-miranda-orange-dark bg-miranda-orange-light/10' 
                    : 'text-miranda-gray-dark/60 hover:text-miranda-orange-dark hover:bg-miranda-orange-light/5 active:bg-miranda-orange-light/20'
                }`}
              >
                <div className={`flex items-center justify-center transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium leading-none tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-miranda-orange-dark rounded-full mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area spacer for devices with home indicators */}
      <div className="h-safe-area-bottom bg-white"></div>
    </nav>
  );
};