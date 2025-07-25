import React from 'react';
import logo from '../../assets/logo.jpeg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = false, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden shadow-lg border border-white/20`}>
        <img 
          src={logo} 
          alt="MIRA MÓVIL Logo" 
          className="w-full h-full object-cover"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-miranda-gray-dark leading-tight ${textSizeClasses[size]}`}>
            MIRA MÓVIL
          </span>
          <span className="text-xs text-miranda-gray-dark/60 leading-none">
            Miranda Arquitectura
          </span>
        </div>
      )}
    </div>
  );
};
