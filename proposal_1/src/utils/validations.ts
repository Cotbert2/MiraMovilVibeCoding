export const validarCedula = (cedula: string): boolean => {
  if (cedula.length !== 10 || !/^\d+$/.test(cedula)) return false;
  
  const digitos = cedula.split('').map(Number);
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = digitos[i] * coeficientes[i];
    if (valor >= 10) valor = valor - 9;
    suma += valor;
  }
  
  const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  return digitoVerificador === digitos[9];
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarContraseña = (contraseña: string): boolean => {
  return contraseña.length >= 6;
};

export const validarUsuario = (usuario: string): boolean => {
  return usuario.length >= 3 && /^[a-zA-Z0-9_]+$/.test(usuario);
};

export const validarCodigo = (codigo: string): boolean => {
  return codigo.length >= 3 && /^[A-Z0-9-]+$/.test(codigo);
};

export const validarTexto = (texto: string, minLength: number = 2): boolean => {
  return texto.trim().length >= minLength;
};

// Función para validar campos requeridos
export const validarCampoRequerido = (valor: string | number | undefined | null): boolean => {
  if (valor === undefined || valor === null) return false;
  if (typeof valor === 'string') return valor.trim().length > 0;
  if (typeof valor === 'number') return valor > 0;
  return Boolean(valor);
};

// Función para validar que solo contenga números
export const validarSoloNumeros = (valor: string): boolean => {
  return /^\d+$/.test(valor);
};

// Función para validar números decimales
export const validarNumeroDecimal = (valor: string): boolean => {
  return /^\d+(\.\d+)?$/.test(valor);
};

// Función para validar rangos de fechas
export const validarRangoFechas = (fechaInicio: string, fechaFin: string): boolean => {
  if (!fechaInicio || !fechaFin) return false;
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  return inicio <= fin;
};

// Función para validar teléfonos
export const validarTelefono = (telefono: string): boolean => {
  return /^[0-9]{7,10}$/.test(telefono.replace(/[\s\-\(\)]/g, ''));
};

// Función para validar nombres (solo letras y espacios)
export const validarNombre = (nombre: string): boolean => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim()) && nombre.trim().length >= 2;
};