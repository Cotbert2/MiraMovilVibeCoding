import React from 'react';
import { Logo } from './Logo';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Logo animado */}
        <div className="relative">
          <div className="animate-pulse">
            <Logo size="lg" />
          </div>
          
          {/* Spinner alrededor del logo */}
          <div className="absolute inset-0 w-16 h-16 border-4 border-miranda-orange-light/30 border-t-miranda-orange-dark rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de carga */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-miranda-gray-dark mb-1">MIRA MÓVIL</h2>
          <p className="text-sm text-miranda-gray-dark/70">Cargando...</p>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-32 h-1 bg-miranda-gray-light rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-miranda-orange-dark to-miranda-orange-light animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};