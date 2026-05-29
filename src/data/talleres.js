/**
 * TALLERES DEMO — MARCA BLANCA
 * ────────────────────────────
 * Cada taller tiene su propia identidad visual y de contacto.
 * La vista de la aplicación se adapta al taller logueado.
 */

export const talleres = [
  {
    id: "taller-a",
    nombre: "MotoTech",
    eslogan: "Gestión de taller",
    iniciales: "MT",
    logoEmoji: "⚙️",
    color: "cyan", // primary tailwind color
    telefono: "+57 606 312 4500",
    email: "contacto@mototechpereira.co",
    direccion: "Av. 30 de Agosto #45-12, Pereira",
    horario: "Lun-Sáb 8:00 AM - 6:00 PM",
    anioFundacion: 2023,
    nit: "900.123.456-7",
    // Credenciales demo
    usuario: "admin@mototech.co",
    password: "demo123",
  },
  {
    id: "taller-b",
    nombre: "RPM Garage",
    eslogan: "Motos a otro nivel",
    iniciales: "RG",
    logoEmoji: "⚙️",
    color: "orange",
    telefono: "+57 604 555 7788",
    email: "info@rpmgarage.co",
    direccion: "Cra. 50 #80-23, Medellín",
    horario: "Lun-Vie 7:30 AM - 7:00 PM · Sáb 8:00 AM - 2:00 PM",
    anioFundacion: 2019,
    nit: "901.987.654-3",
    usuario: "admin@rpm.co",
    password: "demo123",
  },
];

/**
 * Paleta de colores tailwind por taller.
 * Mantenemos clases completas para que Tailwind las detecte (no concatenamos).
 */
export const themeByColor = {
  cyan: {
    primaryText: "text-cyan-400",
    primaryBg: "bg-cyan-500",
    primaryBgSoft: "bg-cyan-500/20",
    primaryBgHover: "hover:bg-cyan-500/10",
    primaryHoverText: "hover:text-cyan-400",
    primaryBorder: "border-cyan-500/20",
    gradient: "from-cyan-500 to-blue-600",
    ring: "focus:ring-cyan-500",
  },
  orange: {
    primaryText: "text-orange-400",
    primaryBg: "bg-orange-500",
    primaryBgSoft: "bg-orange-500/20",
    primaryBgHover: "hover:bg-orange-500/10",
    primaryHoverText: "hover:text-orange-400",
    primaryBorder: "border-orange-500/20",
    gradient: "from-orange-500 to-red-600",
    ring: "focus:ring-orange-500",
  },
  purple: {
    primaryText: "text-purple-400",
    primaryBg: "bg-purple-500",
    primaryBgSoft: "bg-purple-500/20",
    primaryBgHover: "hover:bg-purple-500/10",
    primaryHoverText: "hover:text-purple-400",
    primaryBorder: "border-purple-500/20",
    gradient: "from-purple-500 to-pink-600",
    ring: "focus:ring-purple-500",
  },
};

export const getTheme = (color) => themeByColor[color] || themeByColor.cyan;
