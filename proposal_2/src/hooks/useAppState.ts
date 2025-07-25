import { useState, useCallback, useEffect } from 'react';
import { User, Maquinaria, Movimiento, AuthState, PantallaActual, LoginData, RecuperarData, RegistroUsuarioData, FiltrosInforme } from '../types';
import { validarCedula, validarEmail } from '../utils/validations';

const USUARIOS_MOCK: User[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '1234567890',
    correo: 'juan.perez@empresa.com',
    usuario: 'jperez',
    rol: 'Jefe de Compras',
    estado: 'Activo',
    fechaCreacion: '2024-01-15'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    cedula: '0987654321',
    correo: 'maria.gonzalez@empresa.com',
    usuario: 'mgonzalez',
    rol: 'Bodeguero',
    estado: 'Activo',
    fechaCreacion: '2024-02-10'
  }
];

const MAQUINARIA_MOCK: Maquinaria[] = [
  {
    id: '1',
    codigo: 'EXC-001',
    nombre: 'Excavadora Principal',
    tipo: 'Excavadora',
    marca: 'Caterpillar',
    modelo: '320D',
    año: 2022,
    numeroSerie: 'CAT-320D-001',
    estado: 'Nuevo',
    ubicacionActual: 'Bodega Central',
    descripcion: 'Excavadora nueva para trabajos pesados',
    valorCompra: 150000,
    fechaRegistro: '2024-01-10'
  },
  {
    id: '2',
    codigo: 'GRU-001',
    nombre: 'Grúa Torre',
    tipo: 'Grúa',
    marca: 'Liebherr',
    modelo: 'LTM 1100',
    año: 2021,
    numeroSerie: 'LIE-LTM-002',
    estado: 'Usado - Excelente',
    ubicacionActual: 'Proyecto Norte',
    descripcion: 'Grúa de gran capacidad',
    valorCompra: 280000,
    fechaRegistro: '2024-01-15'
  }
];

const MOVIMIENTOS_MOCK: Movimiento[] = [
  {
    id: '1',
    maquinariaId: '1',
    maquinariaNombre: 'Excavadora Principal',
    tipoMovimiento: 'Salida',
    obra: 'Proyecto Norte',
    fecha: '2024-07-20',
    usuario: 'jperez',
    observaciones: 'Traslado para excavación'
  },
  {
    id: '2',
    maquinariaId: '2',
    maquinariaNombre: 'Grúa Torre',
    tipoMovimiento: 'Entrada',
    obra: 'Proyecto Sur',
    fecha: '2024-07-22',
    usuario: 'mgonzalez'
  }
];

export const useAppState = () => {
  const [pantallaActual, setPantallaActual] = useState<PantallaActual>('login');
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    intentosFallidos: 0,
    bloqueado: false
  });
  const [usuarios, setUsuarios] = useState<User[]>(USUARIOS_MOCK);
  const [maquinaria, setMaquinaria] = useState<Maquinaria[]>(MAQUINARIA_MOCK);
  const [movimientos, setMovimientos] = useState<Movimiento[]>(MOVIMIENTOS_MOCK);
  const [isLoading, setIsLoading] = useState(false);

  // Simular desbloqueo después de 2 minutos
  useEffect(() => {
    if (authState.bloqueado && authState.tiempoBloqueo) {
      const timeout = setTimeout(() => {
        setAuthState(prev => ({
          ...prev,
          bloqueado: false,
          intentosFallidos: 0,
          tiempoBloqueo: undefined
        }));
      }, 120000); // 2 minutos

      return () => clearTimeout(timeout);
    }
  }, [authState.bloqueado, authState.tiempoBloqueo]);

  const login = useCallback(async (data: LoginData): Promise<{ success: boolean; message: string }> => {
    if (authState.bloqueado) {
      return { success: false, message: 'Cuenta bloqueada. Intente nuevamente en 2 minutos.' };
    }

    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const usuario = usuarios.find(u => u.usuario === data.usuario && u.estado === 'Activo');
    
    // Mock: contraseña es el mismo usuario para simplificar
    if (usuario && data.contraseña === data.usuario) {
      setAuthState({
        isAuthenticated: true,
        user: usuario,
        intentosFallidos: 0,
        bloqueado: false
      });
      setPantallaActual('principal');
      setIsLoading(false);
      return { success: true, message: 'Inicio de sesión exitoso' };
    } else {
      const nuevosIntentos = authState.intentosFallidos + 1;
      const esBloqueado = nuevosIntentos >= 3;
      
      setAuthState(prev => ({
        ...prev,
        intentosFallidos: nuevosIntentos,
        bloqueado: esBloqueado,
        tiempoBloqueo: esBloqueado ? Date.now() : undefined
      }));
      
      setIsLoading(false);
      
      if (esBloqueado) {
        return { success: false, message: 'Máximo de intentos excedido. Cuenta bloqueada por 2 minutos.' };
      } else {
        return { success: false, message: `Credenciales incorrectas. Intentos restantes: ${3 - nuevosIntentos}` };
      }
    }
  }, [authState.bloqueado, authState.intentosFallidos, usuarios]);

  const recuperarContraseña = useCallback(async (data: RecuperarData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const usuario = usuarios.find(u => u.correo === data.correo);
    
    setIsLoading(false);
    
    if (usuario) {
      return { success: true, message: 'Se ha enviado un enlace de recuperación a su correo electrónico.' };
    } else {
      return { success: false, message: 'El correo electrónico no está registrado en el sistema.' };
    }
  }, [usuarios]);

  const registrarUsuario = useCallback(async (data: RegistroUsuarioData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validaciones
    if (!validarCedula(data.cedula)) {
      setIsLoading(false);
      return { success: false, message: 'Cédula inválida. Verifique el dígito verificador.' };
    }
    
    if (!validarEmail(data.correo)) {
      setIsLoading(false);
      return { success: false, message: 'Formato de correo electrónico inválido.' };
    }
    
    // Verificar duplicados
    const existeUsuario = usuarios.some(u => u.usuario === data.usuario);
    const existeCedula = usuarios.some(u => u.cedula === data.cedula);
    const existeCorreo = usuarios.some(u => u.correo === data.correo);
    
    if (existeUsuario) {
      setIsLoading(false);
      return { success: false, message: 'El nombre de usuario ya existe.' };
    }
    
    if (existeCedula) {
      setIsLoading(false);
      return { success: false, message: 'La cédula ya está registrada.' };
    }
    
    if (existeCorreo) {
      setIsLoading(false);
      return { success: false, message: 'El correo electrónico ya está registrado.' };
    }
    
    const nuevoUsuario: User = {
      id: Date.now().toString(),
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      correo: data.correo,
      usuario: data.usuario,
      rol: data.rol,
      estado: 'Activo',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    
    setUsuarios(prev => [...prev, nuevoUsuario]);
    setIsLoading(false);
    
    return { success: true, message: 'Usuario creado exitosamente.' };
  }, [usuarios]);

  const actualizarUsuario = useCallback(async (id: string, data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    setIsLoading(false);
    
    return { success: true, message: 'Usuario actualizado exitosamente.' };
  }, []);

  const eliminarUsuario = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar dependencias (movimientos)
    const tieneDependencias = movimientos.some(m => m.usuario === usuarios.find(u => u.id === id)?.usuario);
    
    if (tieneDependencias) {
      setIsLoading(false);
      return { success: false, message: 'No se puede eliminar el usuario porque tiene movimientos registrados.' };
    }
    
    setUsuarios(prev => prev.filter(u => u.id !== id));
    setIsLoading(false);
    
    return { success: true, message: 'Usuario eliminado exitosamente.' };
  }, [usuarios, movimientos]);

  const registrarMaquinaria = useCallback(async (data: Omit<Maquinaria, 'id' | 'fechaRegistro'>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar código único
    const existeCodigo = maquinaria.some(m => m.codigo === data.codigo);
    
    if (existeCodigo) {
      setIsLoading(false);
      return { success: false, message: 'El código de maquinaria ya existe.' };
    }
    
    const nuevaMaquinaria: Maquinaria = {
      ...data,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    
    setMaquinaria(prev => [...prev, nuevaMaquinaria]);
    setIsLoading(false);
    
    return { success: true, message: 'Maquinaria registrada exitosamente.' };
  }, [maquinaria]);

  const registrarMovimiento = useCallback(async (data: Omit<Movimiento, 'id' | 'fecha' | 'usuario' | 'maquinariaNombre'>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const maquinariaSeleccionada = maquinaria.find(m => m.id === data.maquinariaId);
    
    if (!maquinariaSeleccionada) {
      setIsLoading(false);
      return { success: false, message: 'Maquinaria no encontrada.' };
    }
    
    const nuevoMovimiento: Movimiento = {
      ...data,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      usuario: authState.user?.usuario || '',
      maquinariaNombre: maquinariaSeleccionada.nombre
    };
    
    setMovimientos(prev => [...prev, nuevoMovimiento]);
    setIsLoading(false);
    
    return { success: true, message: 'Movimiento registrado exitosamente.' };
  }, [maquinaria, authState.user]);

  const generarInforme = useCallback(async (filtros: FiltrosInforme): Promise<{ success: boolean; message: string; url?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular generación de PDF
    const movimientosFiltrados = movimientos.filter(mov => {
      const fechaMovimiento = new Date(mov.fecha);
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);
      
      let cumpleFechas = fechaMovimiento >= fechaInicio && fechaMovimiento <= fechaFin;
      
      if (filtros.obra) {
        cumpleFechas = cumpleFechas && mov.obra.toLowerCase().includes(filtros.obra.toLowerCase());
      }
      
      if (filtros.tipoMaquinaria) {
        const maq = maquinaria.find(m => m.id === mov.maquinariaId);
        cumpleFechas = cumpleFechas && maq?.tipo === filtros.tipoMaquinaria;
      }
      
      return cumpleFechas;
    });
    
    setIsLoading(false);
    
    if (movimientosFiltrados.length === 0) {
      return { success: false, message: 'No se encontraron movimientos con los filtros aplicados.' };
    }
    
    // Simular URL de descarga
    const url = `data:text/plain;charset=utf-8,Informe de Movimientos\nFecha: ${new Date().toLocaleDateString()}\nMovimientos encontrados: ${movimientosFiltrados.length}`;
    
    return { 
      success: true, 
      message: `Informe generado exitosamente. ${movimientosFiltrados.length} movimientos encontrados.`,
      url 
    };
  }, [movimientos, maquinaria]);

  const obtenerUsuarios = useCallback(() => usuarios, [usuarios]);
  const obtenerMaquinaria = useCallback(() => maquinaria, [maquinaria]);
  const obtenerMovimientos = useCallback(() => movimientos, [movimientos]);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      intentosFallidos: 0,
      bloqueado: false
    });
    setPantallaActual('login');
  }, []);

  return {
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
  };
};