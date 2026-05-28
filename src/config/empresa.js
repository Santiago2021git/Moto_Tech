/**
 * CONFIGURACIÓN DE EMPRESA — MARCA BLANCA
 * ───────────────────────────────────────
 * Espejo mutable de los datos del taller actualmente logueado.
 * `setEmpresa()` actualiza estos campos al iniciar sesión o al cambiar de taller.
 *
 * Los componentes pueden seguir haciendo
 *     import empresa from "../config/empresa"
 * y leerán siempre el estado más reciente porque se mantiene la misma referencia.
 */

const empresa = {
  nombre: "MotoTech",
  eslogan: "Gestión de taller",
  iniciales: "MT",
  logoEmoji: "🏍️",
  color: "cyan",
  telefono: "",
  email: "",
  direccion: "",
  horario: "",
  anioFundacion: new Date().getFullYear(),
  nit: "",
};

/** Sobrescribe los campos de `empresa` con los del taller activo. */
export function setEmpresa(taller) {
  if (!taller) return;
  for (const k of Object.keys(empresa)) delete empresa[k];
  Object.assign(empresa, taller);
}

export default empresa;
