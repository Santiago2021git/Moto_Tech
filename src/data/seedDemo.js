// Datos demo genuinos para el taller ViveMotos.
// Se cargan en el seed inicial de AppContext (STORAGE_KEY versión v3).
// Si el usuario crea su propio taller, NO se le inyectan estos datos.

const TID = "taller-vivemotos";
const CID_USUARIO = "cli-carlos";
const CID_USUARIO_2 = "cli-andrea";

// ────────────────────────────────────────────────────────────────────────────
// Catálogo estándar de servicios para motos en Colombia.
// Se siembra automáticamente en cada taller nuevo (vía registrarTaller).
// ────────────────────────────────────────────────────────────────────────────
export const serviciosEstandarCO = [
  { titulo: "Cambio de aceite y filtro",         categoria: "Mantenimiento", descripcion: "Cambio de aceite sintético + filtro de aceite original.",                  duracion: "45 min",  precio: "$80.000",  incluye: ["Aceite sintético", "Filtro de aceite", "Mano de obra"] },
  { titulo: "Sincronización electrónica",        categoria: "Motor",         descripcion: "Calibración de inyección/carburador y limpieza de cuerpo de aceleración.", duracion: "1 h 30 min", precio: "$120.000", incluye: ["Limpieza", "Calibración", "Diagnóstico"] },
  { titulo: "Mantenimiento preventivo general",  categoria: "Mantenimiento", descripcion: "Revisión de 30 puntos: aceite, frenos, cadena, luces y suspensión.",       duracion: "2 h",     precio: "$180.000", incluye: ["Revisión 30 puntos", "Ajustes menores", "Lubricación"] },
  { titulo: "Cambio de pastillas de freno",      categoria: "Frenos",        descripcion: "Reemplazo de pastillas delanteras o traseras y purga del sistema.",        duracion: "1 h",     precio: "$95.000",  incluye: ["Pastillas originales", "Purga", "Mano de obra"] },
  { titulo: "Kit de arrastre completo",          categoria: "Transmisión",   descripcion: "Cadena + piñón + plato. Reemplazo completo y ajuste.",                     duracion: "1 h 30 min", precio: "$220.000", incluye: ["Kit de arrastre", "Lubricante", "Mano de obra"] },
  { titulo: "Cambio de llantas (par)",           categoria: "Llantas",       descripcion: "Desmontaje, montaje y balanceo de dos llantas.",                            duracion: "1 h",     precio: "$60.000",  incluye: ["Montaje", "Balanceo", "Mano de obra"] },
  { titulo: "Cambio de batería",                 categoria: "Eléctrico",     descripcion: "Diagnóstico, retiro e instalación de batería nueva 12V.",                   duracion: "30 min",  precio: "$45.000",  incluye: ["Diagnóstico", "Instalación", "Mano de obra"] },
  { titulo: "Lavado de carburador",              categoria: "Motor",         descripcion: "Desmontaje, limpieza con ultrasonido y calibración del carburador.",       duracion: "2 h",     precio: "$130.000", incluye: ["Limpieza ultrasonido", "Calibración", "Mano de obra"] },
  { titulo: "Revisión y ajuste de suspensión",   categoria: "Suspensión",    descripcion: "Cambio de aceite de horquilla y revisión de amortiguadores traseros.",    duracion: "2 h 30 min", precio: "$210.000", incluye: ["Aceite de horquilla", "Empaques", "Mano de obra"] },
  { titulo: "Ajuste de embrague",                categoria: "Transmisión",   descripcion: "Regulación o cambio de discos de embrague.",                                duracion: "1 h 30 min", precio: "$110.000", incluye: ["Diagnóstico", "Ajuste", "Mano de obra"] },
  { titulo: "Escaneo electrónico OBD",           categoria: "Eléctrico",     descripcion: "Lectura de códigos de falla y diagnóstico computarizado.",                  duracion: "45 min",  precio: "$60.000",  incluye: ["Escáner", "Reporte impreso"] },
  { titulo: "Revisión técnico-mecánica previa",  categoria: "Mantenimiento", descripcion: "Inspección de 50 puntos para pasar la revisión técnico-mecánica.",        duracion: "1 h",     precio: "$70.000",  incluye: ["Inspección", "Recomendaciones"] },
];

// ────────────────────────────────────────────────────────────────────────────
// Seed del super-usuario MotoTech (cuenta especial, solo lectura).
// ────────────────────────────────────────────────────────────────────────────
export const seedSuperUsuario = {
  id: "super-mototech",
  isSuper: true,
  nombre: "MotoTech",
  email: "admin@mototech.co",
  password: "super123",
  iniciales: "MT",
  logoEmoji: "🛠️",
  color: "cyan",
};

// ────────────────────────────────────────────────────────────────────────────
// Seed del taller principal: ViveMotos
// ────────────────────────────────────────────────────────────────────────────
export const seedTaller = {
  id: TID,
  nombre: "ViveMotos",
  eslogan: "Tu moto, en las mejores manos",
  iniciales: "VM",
  logoEmoji: "🏍️",
  color: "cyan",
  telefono: "606 312 4500",
  email: "contacto@vivemotos.co",
  direccion: "Av. 30 de Agosto #45-12, Pereira",
  horario: "Lun-Sáb 8:00 AM - 6:00 PM",
  descripcion: "Taller especializado en motocicletas de todas las marcas. Más de 5 años de experiencia ofreciendo mantenimiento preventivo y correctivo en Pereira.",
  ciudad: "Pereira",
  anioFundacion: 2021,
  nit: "900.456.789-3",
  usuario: "contacto@vivemotos.co",
  password: "demo123",
  logoBase64: null,
};

// ────────────────────────────────────────────────────────────────────────────
// Usuarios cliente demo (registrados como clientes-app, no fichas)
// ────────────────────────────────────────────────────────────────────────────
export const seedUsuariosCliente = [
  {
    id: CID_USUARIO,
    tallerId: TID,
    nombre: "Carlos Martínez",
    iniciales: "CM",
    email: "carlos@demo.co",
    password: "demo123",
    telefono: "310 456 7890",
    direccion: "Calle 50 #25-30, Pereira",
    documento: "1.087.654.321",
  },
  {
    id: CID_USUARIO_2,
    tallerId: TID,
    nombre: "Andrea Gómez",
    iniciales: "AG",
    email: "andrea@demo.co",
    password: "demo123",
    telefono: "320 789 1234",
    direccion: "Carrera 7 #18-44, Pereira",
    documento: "1.094.321.567",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Clientes (fichas del taller). Algunos coinciden con usuariosCliente.
// ────────────────────────────────────────────────────────────────────────────
export const seedClientes = [
  { id: "clt-1", tallerId: TID, usuarioId: CID_USUARIO,   nombre: "Carlos Martínez",  iniciales: "CM", email: "carlos@demo.co",    telefono: "310 456 7890", direccion: "Calle 50 #25-30, Pereira",   estado: "Activo",   avatarColor: "from-blue-600 to-blue-400",       vehiculos: 1, gastado: "$295.000", ultimaVisita: "15/05/2026" },
  { id: "clt-2", tallerId: TID, usuarioId: CID_USUARIO_2, nombre: "Andrea Gómez",     iniciales: "AG", email: "andrea@demo.co",    telefono: "320 789 1234", direccion: "Carrera 7 #18-44, Pereira",  estado: "Activo",   avatarColor: "from-purple-600 to-purple-400",   vehiculos: 1, gastado: "$180.000", ultimaVisita: "22/05/2026" },
  { id: "clt-3", tallerId: TID,                             nombre: "Juan Restrepo",   iniciales: "JR", email: "juan.restrepo@gmail.com", telefono: "311 234 5678", direccion: "Calle 14 #20-30, Pereira",   estado: "Activo",   avatarColor: "from-emerald-600 to-teal-400",     vehiculos: 1, gastado: "$95.000",  ultimaVisita: "10/05/2026" },
  { id: "clt-4", tallerId: TID,                             nombre: "Laura Quintero",  iniciales: "LQ", email: "laura.quintero@gmail.com", telefono: "315 678 9012", direccion: "Av. Circunvalar #10-25",     estado: "Inactivo", avatarColor: "from-orange-500 to-red-500",       vehiculos: 1, gastado: "$0",       ultimaVisita: "—" },
];

// ────────────────────────────────────────────────────────────────────────────
// Vehículos (motos) demo
// ────────────────────────────────────────────────────────────────────────────
const hoy = new Date();
const haceDias = (n) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const enDias = (n) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedVehiculos = [
  {
    id: "veh-1", tallerId: TID, clienteUsuarioId: CID_USUARIO,
    placa: "ABC123", marca: "Honda", modelo: "CB 190R", año: 2022, color: "Rojo",
    cliente: "Carlos Martínez", telefono: "310 456 7890",
    estado: "En Proceso", avance: 60, tecnico: "Roberto Gómez",
    ingreso: haceDias(2), entregaEstimada: enDias(1),
    diagnostico: "Sincronización pendiente y cambio de pastillas delanteras.",
    ordenServicio: "OS-100001",
    servicios: 1,
    serviciosCotizados: [
      { item: "Sincronización electrónica", valor: 120000 },
      { item: "Pastillas de freno delanteras", valor: 95000 },
      { item: "Mano de obra", valor: 80000 },
    ],
    historial: [
      { titulo: "Moto recibida", descripcion: "Ingreso al taller. Se hizo inventario visual.", fecha: haceDias(2), visibleCliente: true },
      { titulo: "Diagnóstico inicial", descripcion: "Se detectó falla de sincronización y desgaste en pastillas.", fecha: haceDias(1), visibleCliente: true },
    ],
  },
  {
    id: "veh-2", tallerId: TID, clienteUsuarioId: CID_USUARIO_2,
    placa: "DEF456", marca: "Yamaha", modelo: "FZ 2.0", año: 2023, color: "Azul",
    cliente: "Andrea Gómez", telefono: "320 789 1234",
    estado: "Finalizada", avance: 100, tecnico: "Laura Sánchez",
    ingreso: haceDias(10), entregaEstimada: haceDias(8),
    diagnostico: "Mantenimiento preventivo 10.000 km.",
    ordenServicio: "OS-100002",
    servicios: 1,
    serviciosCotizados: [
      { item: "Mantenimiento preventivo general", valor: 180000 },
    ],
    historial: [
      { titulo: "Moto recibida", descripcion: "Ingreso para mantenimiento preventivo.", fecha: haceDias(10), visibleCliente: true },
      { titulo: "Servicio en proceso", descripcion: "Revisión de 30 puntos en curso.", fecha: haceDias(9), visibleCliente: true },
      { titulo: "Servicio finalizado", descripcion: "Todo en orden, moto lista para entrega.", fecha: haceDias(8), visibleCliente: true },
    ],
    reporteEntrega: {
      fecha: haceDias(8),
      tecnico: "Laura Sánchez",
      descripcion: "Se realizó mantenimiento preventivo completo: cambio de aceite sintético, filtro nuevo, revisión y lubricación de cadena, ajuste de frenos y revisión eléctrica. La moto quedó en perfecto estado.",
      valorTotal: 180000,
      recomendaciones: "Próximo mantenimiento a los 15.000 km. Lubricar la cadena cada 500 km.",
      fotos: [],
    },
  },
  {
    id: "veh-3", tallerId: TID,
    placa: "GHI789", marca: "Suzuki", modelo: "Gixxer 150", año: 2021, color: "Negro",
    cliente: "Juan Restrepo", telefono: "311 234 5678",
    estado: "Sin Atender", avance: 0, tecnico: "Por asignar",
    ingreso: haceDias(0), entregaEstimada: enDias(3),
    diagnostico: "",
    ordenServicio: "OS-100003",
    servicios: 0,
    serviciosCotizados: [],
    historial: [
      { titulo: "Moto recibida", descripcion: "Pendiente de diagnóstico.", fecha: haceDias(0), visibleCliente: true },
    ],
  },
  {
    id: "veh-4", tallerId: TID,
    placa: "JKL012", marca: "Bajaj", modelo: "Pulsar NS200", año: 2024, color: "Blanco",
    cliente: "Laura Quintero", telefono: "315 678 9012",
    estado: "En Proceso", avance: 30, tecnico: "Miguel Castaño",
    ingreso: haceDias(1), entregaEstimada: enDias(2),
    diagnostico: "Ruido en cadena y desgaste de piñón.",
    ordenServicio: "OS-100004",
    servicios: 1,
    serviciosCotizados: [
      { item: "Kit de arrastre completo", valor: 220000 },
    ],
    historial: [
      { titulo: "Moto recibida", descripcion: "Cliente reporta ruido al acelerar.", fecha: haceDias(1), visibleCliente: true },
      { titulo: "Diagnóstico", descripcion: "Cadena y piñón en estado crítico, requiere cambio.", fecha: haceDias(0), visibleCliente: true },
    ],
  },
  {
    id: "veh-5", tallerId: TID, clienteUsuarioId: CID_USUARIO,
    placa: "MNO345", marca: "KTM", modelo: "Duke 200", año: 2023, color: "Naranja",
    cliente: "Carlos Martínez", telefono: "310 456 7890",
    estado: "Finalizada", avance: 100, tecnico: "Roberto Gómez",
    ingreso: haceDias(20), entregaEstimada: haceDias(18),
    diagnostico: "Cambio de aceite y revisión general.",
    ordenServicio: "OS-100005",
    servicios: 1,
    serviciosCotizados: [
      { item: "Cambio de aceite y filtro", valor: 80000 },
      { item: "Revisión técnico-mecánica previa", valor: 70000 },
    ],
    historial: [
      { titulo: "Moto recibida", descripcion: "Ingreso de rutina.", fecha: haceDias(20), visibleCliente: true },
      { titulo: "Servicio finalizado", descripcion: "Aceite cambiado y revisión completada.", fecha: haceDias(18), visibleCliente: true },
    ],
    reporteEntrega: {
      fecha: haceDias(18),
      tecnico: "Roberto Gómez",
      descripcion: "Cambio de aceite con sintético 10W-40 y filtro nuevo. La moto pasa sin problema la revisión técnico-mecánica.",
      valorTotal: 150000,
      recomendaciones: "Próximo cambio de aceite a los 3.000 km adicionales.",
      fotos: [],
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Empleados demo
// ────────────────────────────────────────────────────────────────────────────
export const seedEmpleados = [
  { id: "emp-1", tallerId: TID, nombre: "Roberto Gómez",  iniciales: "RG", rol: "Mecánico Senior",     estado: "Disponible", rating: 4.8, especialidades: ["Motor", "Transmisión"], servicios: 47, eficiencia: 92, ingreso: "marzo 2024",     avatarColor: "from-blue-600 to-indigo-600" },
  { id: "emp-2", tallerId: TID, nombre: "Laura Sánchez",   iniciales: "LS", rol: "Mecánico Junior",     estado: "Ocupado",    rating: 4.5, especialidades: ["Frenos", "Suspensión"], servicios: 23, eficiencia: 85, ingreso: "agosto 2024",   avatarColor: "from-purple-600 to-pink-600" },
  { id: "emp-3", tallerId: TID, nombre: "Miguel Castaño",  iniciales: "MC", rol: "Especialista Eléctrico", estado: "Disponible", rating: 4.7, especialidades: ["Eléctrico", "Diagnóstico"], servicios: 31, eficiencia: 88, ingreso: "enero 2025",     avatarColor: "from-emerald-500 to-teal-600" },
  { id: "emp-4", tallerId: TID, nombre: "Diana Hernández", iniciales: "DH", rol: "Auxiliar de Taller",  estado: "Disponible", rating: 4.4, especialidades: ["Lavado", "Soporte"],     servicios: 18, eficiencia: 80, ingreso: "marzo 2025",     avatarColor: "from-orange-500 to-red-600" },
];

// ────────────────────────────────────────────────────────────────────────────
// Inventario demo
// ────────────────────────────────────────────────────────────────────────────
export const seedInventario = [
  { id: "itm-1",  tallerId: TID, nombre: "Aceite Motul 10W-40 sintético", marca: "Motul",   codigo: "MOT-10W40", categoria: "Lubricantes", stock: 18, minStock: 8,  precio: "$45.000",  ubicacion: "Estante A-1", color: "from-blue-600 to-indigo-600" },
  { id: "itm-2",  tallerId: TID, nombre: "Filtro de aceite K&N",         marca: "K&N",     codigo: "KN-FIL-01", categoria: "Filtros",     stock: 5,  minStock: 8,  precio: "$32.000",  ubicacion: "Estante A-2", color: "from-purple-600 to-pink-600" },
  { id: "itm-3",  tallerId: TID, nombre: "Cadena DID 520",                marca: "DID",     codigo: "DID-520",   categoria: "Transmisión", stock: 3,  minStock: 5,  precio: "$180.000", ubicacion: "Estante B-1", color: "from-emerald-500 to-teal-600" },
  { id: "itm-4",  tallerId: TID, nombre: "Bujía NGK Iridium",             marca: "NGK",     codigo: "NGK-IR-01", categoria: "Eléctrico",   stock: 24, minStock: 10, precio: "$28.000",  ubicacion: "Estante C-3", color: "from-orange-500 to-red-600" },
  { id: "itm-5",  tallerId: TID, nombre: "Pastillas freno delanteras",    marca: "EBC",     codigo: "EBC-FD-01", categoria: "Frenos",      stock: 12, minStock: 6,  precio: "$65.000",  ubicacion: "Estante D-1", color: "from-cyan-500 to-blue-600" },
  { id: "itm-6",  tallerId: TID, nombre: "Llanta Michelin Pilot Street",  marca: "Michelin", codigo: "MCH-PS-17", categoria: "Llantas",     stock: 6,  minStock: 4,  precio: "$320.000", ubicacion: "Bodega 1",   color: "from-blue-600 to-indigo-600" },
  { id: "itm-7",  tallerId: TID, nombre: "Batería Yuasa 12V 7Ah",         marca: "Yuasa",   codigo: "YUA-7AH",   categoria: "Eléctrico",   stock: 4,  minStock: 3,  precio: "$120.000", ubicacion: "Estante C-1", color: "from-purple-600 to-pink-600" },
  { id: "itm-8",  tallerId: TID, nombre: "Kit empaques motor 200cc",      marca: "Genérico", codigo: "EMP-200",   categoria: "Otros",        stock: 8,  minStock: 4,  precio: "$45.000",  ubicacion: "Estante E-2", color: "from-emerald-500 to-teal-600" },
  { id: "itm-9",  tallerId: TID, nombre: "Piñón 14 dientes 520",           marca: "JT",      codigo: "JT-14T",    categoria: "Transmisión", stock: 10, minStock: 5,  precio: "$25.000",  ubicacion: "Estante B-2", color: "from-orange-500 to-red-600" },
  { id: "itm-10", tallerId: TID, nombre: "Plato 45 dientes 520",           marca: "JT",      codigo: "JT-45T",    categoria: "Transmisión", stock: 7,  minStock: 4,  precio: "$55.000",  ubicacion: "Estante B-2", color: "from-cyan-500 to-blue-600" },
  { id: "itm-11", tallerId: TID, nombre: "Líquido de frenos DOT 4",        marca: "Bosch",    codigo: "BSH-DOT4",  categoria: "Lubricantes", stock: 15, minStock: 6,  precio: "$22.000",  ubicacion: "Estante A-3", color: "from-blue-600 to-indigo-600" },
  { id: "itm-12", tallerId: TID, nombre: "Filtro de aire universal",       marca: "BMC",     codigo: "BMC-AIR",   categoria: "Filtros",     stock: 9,  minStock: 5,  precio: "$48.000",  ubicacion: "Estante A-2", color: "from-purple-600 to-pink-600" },
];

// ────────────────────────────────────────────────────────────────────────────
// Proveedores demo
// ────────────────────────────────────────────────────────────────────────────
export const seedProveedores = [
  { id: "prv-1", tallerId: TID, nombre: "Motul Colombia",      categoria: "Lubricantes", rating: 4.8, telefono: "601 234 5678", email: "ventas@motul.co",      productos: ["Aceites", "Lubricantes"],           totalOrdenes: 45, ultimaOrden: "15 may", estado: "Activo",   avatarColor: "from-blue-600 to-indigo-600" },
  { id: "prv-2", tallerId: TID, nombre: "K&N Distribuciones",  categoria: "Filtros",     rating: 4.6, telefono: "604 567 8901", email: "info@kndist.com",      productos: ["Filtros de aceite", "Filtros de aire"], totalOrdenes: 28, ultimaOrden: "10 may", estado: "Activo",   avatarColor: "from-purple-600 to-pink-600" },
  { id: "prv-3", tallerId: TID, nombre: "MotoParts S.A",       categoria: "Repuestos",   rating: 4.9, telefono: "300 123 4567", email: "ventas@motoparts.co",  productos: ["Frenos", "Cadenas", "Bujías"],      totalOrdenes: 67, ultimaOrden: "22 may", estado: "Activo",   avatarColor: "from-emerald-500 to-teal-600" },
  { id: "prv-4", tallerId: TID, nombre: "Michelin Risaralda",  categoria: "Llantas",     rating: 4.5, telefono: "606 432 1098", email: "ris@michelin.co",      productos: ["Llantas", "Neumáticos"],           totalOrdenes: 12, ultimaOrden: "01 abr", estado: "Inactivo", avatarColor: "from-orange-500 to-red-600" },
];

// ────────────────────────────────────────────────────────────────────────────
// Citas demo
// ────────────────────────────────────────────────────────────────────────────
export const seedCitas = [
  { id: "cit-1", tallerId: TID, fecha: hoy.toISOString().slice(0, 10), cliente: "Carlos Martínez", vehiculo: "Honda CB 190R - Rojo",   placa: "ABC123", tipo: "Reparación / Servicio", servicio: "Sincronización electrónica", hora: "09:00", notas: "Cliente espera diagnóstico final.", confirmada: true,  estado: "En Revisión" },
  { id: "cit-2", tallerId: TID, fecha: hoy.toISOString().slice(0, 10), cliente: "Juan Restrepo",   vehiculo: "Suzuki Gixxer 150",      placa: "GHI789", tipo: "Revisión Inicial",      servicio: "Mantenimiento preventivo general", hora: "11:00", notas: "",                                   confirmada: false, estado: "Pendiente" },
  { id: "cit-3", tallerId: TID, fecha: enDias(1),                       cliente: "Laura Quintero",  vehiculo: "Bajaj Pulsar NS200",     placa: "JKL012", tipo: "Reparación / Servicio", servicio: "Kit de arrastre completo",      hora: "10:00", notas: "Confirmar disponibilidad del kit.", confirmada: false, estado: "Pendiente" },
  { id: "cit-4", tallerId: TID, fecha: enDias(2),                       cliente: "Andrea Gómez",    vehiculo: "Yamaha FZ 2.0",          placa: "DEF456", tipo: "Revisión Inicial",      servicio: "Escaneo electrónico OBD",         hora: "14:00", notas: "",                                   confirmada: true,  estado: "Pendiente" },
  { id: "cit-5", tallerId: TID, fecha: enDias(3),                       cliente: "Carlos Martínez", vehiculo: "KTM Duke 200",            placa: "MNO345", tipo: "Reparación / Servicio", servicio: "Cambio de aceite y filtro",      hora: "08:30", notas: "",                                   confirmada: false, estado: "Pendiente" },
];

// ────────────────────────────────────────────────────────────────────────────
// Notificaciones demo (solo del taller ViveMotos)
// ────────────────────────────────────────────────────────────────────────────
export const seedNotificaciones = [
  { id: "ntf-1", tallerId: TID, tipo: "alerta",     titulo: "Stock bajo",            mensaje: "El filtro de aceite K&N está por debajo del stock mínimo (5/8).", fecha: hoy.toISOString(), leida: false },
  { id: "ntf-2", tallerId: TID, tipo: "cita",       titulo: "Cita confirmada",       mensaje: "Carlos Martínez confirmó su cita para hoy a las 09:00.",            fecha: hoy.toISOString(), leida: false },
  { id: "ntf-3", tallerId: TID, tipo: "completado", titulo: "Servicio finalizado",   mensaje: "El servicio de la moto DEF456 (Yamaha FZ 2.0) fue completado.",     fecha: haceDias(8) + "T15:00:00", leida: true },
  // Notificaciones para el cliente Andrea (su moto está lista)
  { id: "ntf-4", clienteUsuarioId: CID_USUARIO_2, tipo: "completado", titulo: "Tu moto está lista", mensaje: "ViveMotos terminó el mantenimiento de tu Yamaha FZ 2.0. Ya puedes recogerla y consultar el reporte.", fecha: haceDias(8) + "T15:05:00", leida: false, vehiculoId: "veh-2" },
  { id: "ntf-5", clienteUsuarioId: CID_USUARIO,   tipo: "completado", titulo: "Tu moto está lista", mensaje: "ViveMotos terminó el cambio de aceite de tu KTM Duke 200. Reporte disponible.",                         fecha: haceDias(18) + "T16:00:00", leida: true,  vehiculoId: "veh-5" },
];
