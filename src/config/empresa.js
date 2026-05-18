/**
 * CONFIGURACIÓN DE EMPRESA — MARCA BLANCA
 * ─────────────────────────────────────────
 * Edita este archivo para personalizar la app para cada taller.
 * No se requiere backend: solo cambia los valores abajo y reconstruye.
 */

const empresa = {
  // Nombre que aparece en sidebar, navbar, pestañas del navegador y footer
  nombre: "MotoTech",

  // Eslogan que aparece debajo del nombre en el sidebar
  eslogan: "Gestión de taller",

  // Iniciales para el avatar del perfil en el navbar (máx. 2 caracteres)
  iniciales: "MT",

  // Datos de contacto (usados en Configuración y futuros reportes)
  telefono: "+57 601 234 5678",
  email: "contacto@mototech.co",
  direccion: "Calle 100 #15-20, Bogotá",
  horario: "Lun-Sáb 8:00 AM - 6:00 PM",

  // URL al sistema externo de facturación (dejar vacío si no aplica)
  sistemaFacturacion: {
    nombre: "Sistema Contable Externo",
    url: "",          // Ej: "https://facturacion.miempresa.co"
    instrucciones: "Las facturas se gestionan a través del sistema contable externo del taller. Usa el enlace de arriba para acceder. Aquí puedes registrar referencias de facturas para cruzarlas con los servicios.",
  },

  // Año de fundación (aparece en el copyright del footer)
  anioFundacion: 2026,
};

export default empresa;
