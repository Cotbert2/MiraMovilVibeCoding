export interface User {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  usuario: string;
  rol: 'Jefe de Compras' | 'Bodeguero';
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
}

export interface Maquinaria {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  marca: string;
  modelo: string;
  año: number;
  numeroSerie: string;
  estado: string;
  ubicacionActual: string;
  descripcion: string;
  valorCompra: number;
  fechaRegistro: string;
}

export interface Movimiento {
  id: string;
  maquinariaId: string;
  maquinariaNombre: string;
  tipoMovimiento: 'Entrada' | 'Salida';
  obra: string;
  fecha: string;
  usuario: string;
  observaciones?: string;
}

export interface LoginData {
  usuario: string;
  contraseña: string;
}

export interface RecuperarData {
  correo: string;
}

export interface RegistroUsuarioData {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  rol: 'Jefe de Compras' | 'Bodeguero';
  usuario: string;
  contraseña: string;
}

export interface FiltrosInforme {
  fechaInicio: string;
  fechaFin: string;
  obra?: string;
  tipoMaquinaria?: string;
}

export interface FiltrosConsulta {
  fecha?: string;
  tipoMovimiento?: 'Entrada' | 'Salida';
  maquinaria?: string;
  estado?: string;
}

export type PantallaActual = 
  | 'login'
  | 'recuperar'
  | 'principal'
  | 'gestionUsuarios'
  | 'registrarUsuario'
  | 'listarUsuarios'
  | 'registrarMaquinaria'
  | 'registrarMovimiento'
  | 'consultarRegistros'
  | 'generarInforme';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  intentosFallidos: number;
  bloqueado: boolean;
  tiempoBloqueo?: number;
}