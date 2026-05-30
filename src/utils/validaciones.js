// Helpers de validación reutilizables para todos los formularios.

export const requerido = (valor) => {
  if (valor === null || valor === undefined) return "Este campo es obligatorio.";
  if (typeof valor === "string" && !valor.trim()) return "Este campo es obligatorio.";
  return null;
};

export const validarEmail = (valor) => {
  if (!valor || !valor.trim()) return "El correo es obligatorio.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(valor.trim())) return "Ingresa un correo válido (ejemplo: nombre@dominio.com).";
  return null;
};

// Teléfono Colombia: 10 dígitos, sin +57. Acepta separadores que luego se ignoran.
export const validarTelefono = (valor) => {
  if (!valor || !valor.trim()) return "El teléfono es obligatorio.";
  const limpio = valor.replace(/\D/g, "");
  if (limpio.length !== 10) return "El teléfono debe tener exactamente 10 dígitos.";
  if (!limpio.startsWith("3") && !limpio.startsWith("6")) {
    return "Debe ser un número celular (3xx) o fijo (6xx) de Colombia.";
  }
  return null;
};

export const formatearTelefono = (valor) => {
  const limpio = (valor || "").replace(/\D/g, "").slice(0, 10);
  if (limpio.length <= 3) return limpio;
  if (limpio.length <= 6) return `${limpio.slice(0, 3)} ${limpio.slice(3)}`;
  return `${limpio.slice(0, 3)} ${limpio.slice(3, 6)} ${limpio.slice(6)}`;
};

export const validarPlaca = (valor) => {
  if (!valor || !valor.trim()) return "La placa es obligatoria.";
  const v = valor.trim().toUpperCase().replace(/\s|-/g, "");
  // Placas de moto en Colombia: 3 letras + 2 o 3 dígitos (más tolerante).
  if (!/^[A-Z]{3}\d{2,3}[A-Z]?$/.test(v)) {
    return "Formato de placa inválido (ej: ABC12, ABC123 o ABC12D).";
  }
  return null;
};

export const validarAnio = (valor) => {
  if (!valor) return "El año es obligatorio.";
  const n = Number(valor);
  if (!Number.isInteger(n)) return "El año debe ser un número entero.";
  const actual = new Date().getFullYear();
  if (n < 1950 || n > actual + 1) return `El año debe estar entre 1950 y ${actual + 1}.`;
  return null;
};

export const validarNumeroPositivo = (valor, opciones = {}) => {
  const { min = 0, etiqueta = "El valor" } = opciones;
  if (valor === "" || valor === null || valor === undefined) return `${etiqueta} es obligatorio.`;
  const n = Number(valor);
  if (Number.isNaN(n)) return `${etiqueta} debe ser un número.`;
  if (n < min) return `${etiqueta} debe ser mayor o igual a ${min}.`;
  return null;
};

export const validarPassword = (valor) => {
  if (!valor) return "La contraseña es obligatoria.";
  if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  return null;
};

export const validarFecha = (valor, { futura = false } = {}) => {
  if (!valor) return "La fecha es obligatoria.";
  const d = new Date(valor);
  if (isNaN(d.getTime())) return "Fecha inválida.";
  if (futura) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (d < hoy) return "La fecha debe ser hoy o posterior.";
  }
  return null;
};

// Helper genérico: corre todas las reglas y devuelve { campo: mensaje } solo con errores.
export const validarFormulario = (valores, reglas) => {
  const errores = {};
  for (const campo in reglas) {
    const fns = Array.isArray(reglas[campo]) ? reglas[campo] : [reglas[campo]];
    for (const fn of fns) {
      const error = fn(valores[campo]);
      if (error) { errores[campo] = error; break; }
    }
  }
  return errores;
};
