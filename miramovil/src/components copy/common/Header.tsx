import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from './Logo';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showLogoutButton = false,
  onBack,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-miranda-gray-light bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 safe-area-top">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 h-10 w-10 text-miranda-gray-dark hover:text-miranda-orange-dark hover:bg-miranda-orange-light/10 mobile-touch-target"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
          )}
          
          {/* Logo and title */}
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-miranda-gray-dark leading-tight">{title}</h1>
              <span className="text-xs text-miranda-gray-dark/60 leading-none">Miranda Arquitectura</span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          {showLogoutButton && onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="p-2 h-10 w-10 text-miranda-gray-dark hover:text-miranda-orange-dark hover:bg-miranda-orange-light/10 mobile-touch-target"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};