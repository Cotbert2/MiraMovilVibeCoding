import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useAppState } from './hooks/useAppState';
import { LoginScreen } from './components copy/screens/LoginScreen';
import { RecuperarScreen } from './components copy/screens/RecuperarScreen';
import { PrincipalScreen } from './components copy/screens/PrincipalScreen';
import { GestionUsuariosScreen } from './components copy/screens/GestionUsuariosScreen';
import { RegistrarUsuarioScreen } from './components copy/screens/RegistrarUsuarioScreen';
import { ListarUsuariosScreen } from './components copy/screens/ListarUsuariosScreen';
import { RegistrarMaquinariaScreen } from './components copy/screens/RegistrarMaquinariaScreen';
import { RegistrarMovimientoScreen } from './components copy/screens/RegistrarMovimientoScreen';
import { ConsultarRegistrosScreen } from './components copy/screens/ConsultarRegistrosScreen';
import { GenerarInformeScreen } from './components copy/screens/GenerarInformeScreen';
import { LoadingOverlay } from './components copy/common/LoadingOverlay';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const {
    pantallaActual,
    setPantallaActual,
    authState,
    isLoading,
    login,
    logout,
    recuperarContraseña,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    registrarMaquinaria,
    registrarMovimiento,
    obtenerMovimientos,
    obtenerMaquinaria,
    obtenerUsuarios,
    generarInforme
  } = useAppState();

  // Mobile-first optimizations
  useEffect(() => {
    // Set viewport meta tag programmatically for mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Add mobile web app meta tags
    const metaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'MIRA MÓVIL' },
      { name: 'theme-color', content: '#EA8B2E' },
      { name: 'msapplication-TileColor', content: '#EA8B2E' }
    ];

    metaTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Prevent zoom on focus for iOS
    const preventZoom = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const currentFontSize = window.getComputedStyle(target).fontSize;
        if (parseFloat(currentFontSize) < 16) {
          target.style.fontSize = '16px';
        }
      }
    };

    document.addEventListener('focusin', preventZoom);
    
    return () => {
      document.removeEventListener('focusin', preventZoom);
    };
  }, []);

  if (isLoading) {
    return (
      <IonApp>
        <LoadingOverlay />
      </IonApp>
    );
  }

  const renderScreen = () => {
    switch (pantallaActual) {
      case 'login':
        return (
          <LoginScreen
            login={login}
            setPantallaActual={setPantallaActual}
            authState={authState}
          />
        );
      case 'recuperar':
        return (
          <RecuperarScreen
            recuperarContraseña={recuperarContraseña}
            setPantallaActual={setPantallaActual}
          />
        );
      case 'principal':
        return (
          <PrincipalScreen
            authState={authState}
            setPantallaActual={setPantallaActual}
            logout={logout}
          />
        );
      case 'gestionUsuarios':
        return (
          <GestionUsuariosScreen
            setPantallaActual={setPantallaActual}
          />
        );
      case 'registrarUsuario':
        return (
          <RegistrarUsuarioScreen
            registrarUsuario={registrarUsuario}
            setPantallaActual={setPantallaActual}
          />
        );
      case 'listarUsuarios':
        return (
          <ListarUsuariosScreen
            usuarios={obtenerUsuarios()}
            eliminarUsuario={eliminarUsuario}
            setPantallaActual={setPantallaActual}
          />
        );
      case 'registrarMaquinaria':
        return (
          <RegistrarMaquinariaScreen
            registrarMaquinaria={registrarMaquinaria}
            setPantallaActual={setPantallaActual}
            authState={authState}
          />
        );
      case 'registrarMovimiento':
        return (
          <RegistrarMovimientoScreen
            registrarMovimiento={registrarMovimiento}
            maquinaria={obtenerMaquinaria()}
            setPantallaActual={setPantallaActual}
          />
        );
      case 'consultarRegistros':
        return (
          <ConsultarRegistrosScreen
            movimientos={obtenerMovimientos()}
            maquinaria={obtenerMaquinaria()}
            setPantallaActual={setPantallaActual}
          />
        );
      case 'generarInforme':
        return (
          <GenerarInformeScreen
            movimientos={obtenerMovimientos()}
            setPantallaActual={setPantallaActual}
          />
        );
      default:
        return (
          <LoginScreen
            login={login}
            setPantallaActual={setPantallaActual}
            authState={authState}
          />
        );
    }
  };

  return (
    <IonApp>
      <div className="min-h-screen min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
        {renderScreen()}
      </div>
    </IonApp>
  );
};

export default App;
