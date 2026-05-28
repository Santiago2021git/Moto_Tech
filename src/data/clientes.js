/**
 * CLIENTES DEMO + MOTOS
 * ─────────────────────
 * Vinculados a un taller (tallerId) para simular separación por taller.
 */

export const clientesDemo = [
  {
    id: "cli-1",
    tallerId: "taller-a",
    nombre: "Carlos Martínez",
    iniciales: "CM",
    email: "carlos@demo.co",
    password: "demo123",
    telefono: "+57 310 456 7890",
    direccion: "Calle 50 #25-30, Pereira",
    documento: "1.087.654.321",
  },
  {
    id: "cli-2",
    tallerId: "taller-b",
    nombre: "Laura Gómez",
    iniciales: "LG",
    email: "laura@demo.co",
    password: "demo123",
    telefono: "+57 320 789 4561",
    direccion: "Carrera 70 #12-45, Medellín",
    documento: "1.045.231.789",
  },
];

export const motosDemo = [
  {
    id: "moto-1",
    clienteId: "cli-1",
    tallerId: "taller-a",
    placa: "ABC123",
    marca: "Honda",
    modelo: "CBR 600RR",
    año: "2022",
    color: "Roja",
    estado: "En Proceso",
    ingreso: "2026-05-17",
    entregaEstimada: "2026-05-30",
    tecnico: "Andrés Ramírez",
    diagnostico:
      "Ruido anómalo en transmisión y desgaste de pastillas de freno delanteras. Revisión de cadena y tensores.",
    ordenServicio: "OS-2026-0142",
    avance: 60,
    historial: [
      {
        fecha: "2026-05-17 09:12",
        titulo: "Ingreso al taller",
        descripcion: "Recepción y diagnóstico inicial completado.",
        visibleCliente: true,
      },
      {
        fecha: "2026-05-19 14:30",
        titulo: "Desmontaje de transmisión",
        descripcion:
          "Se identificó desgaste en piñón conductor. Pieza solicitada al proveedor.",
        visibleCliente: true,
        foto: "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600",
      },
      {
        fecha: "2026-05-22 11:00",
        titulo: "Recepción de repuestos",
        descripcion: "Piñón y cadena recibidos. Montaje programado.",
        visibleCliente: true,
      },
      {
        fecha: "2026-05-24 16:45",
        titulo: "Cambio de pastillas",
        descripcion: "Pastillas delanteras reemplazadas y disco rectificado.",
        visibleCliente: true,
        foto: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600",
      },
    ],
    serviciosCotizados: [
      { item: "Cambio de cadena y piñones", valor: 320000 },
      { item: "Pastillas de freno delanteras", valor: 85000 },
      { item: "Mano de obra", valor: 180000 },
    ],
  },
  {
    id: "moto-2",
    clienteId: "cli-1",
    tallerId: "taller-a",
    placa: "GHI456",
    marca: "Yamaha",
    modelo: "FZ 2.0",
    año: "2020",
    color: "Negra",
    estado: "Finalizada",
    ingreso: "2026-04-02",
    entregaEstimada: "2026-04-10",
    tecnico: "Diana López",
    diagnostico: "Mantenimiento preventivo de 20.000 km.",
    ordenServicio: "OS-2026-0098",
    avance: 100,
    historial: [
      {
        fecha: "2026-04-02 08:30",
        titulo: "Mantenimiento preventivo iniciado",
        descripcion: "Aceite, filtros y revisión general.",
        visibleCliente: true,
      },
      {
        fecha: "2026-04-09 17:00",
        titulo: "Entrega",
        descripcion: "Moto entregada al propietario en óptimas condiciones.",
        visibleCliente: true,
      },
    ],
    serviciosCotizados: [
      { item: "Aceite + filtro de aceite", valor: 120000 },
      { item: "Mano de obra mantenimiento", valor: 90000 },
    ],
  },
  {
    id: "moto-3",
    clienteId: "cli-2",
    tallerId: "taller-b",
    placa: "XYZ789",
    marca: "Yamaha",
    modelo: "MT-07",
    año: "2021",
    color: "Azul",
    estado: "Sin Atender",
    ingreso: "2026-05-25",
    entregaEstimada: "2026-06-02",
    tecnico: "Por asignar",
    diagnostico: "Pendiente de revisión técnica inicial.",
    ordenServicio: "OS-2026-0167",
    avance: 5,
    historial: [
      {
        fecha: "2026-05-25 10:00",
        titulo: "Ingreso al taller",
        descripcion: "Moto registrada. En espera de diagnóstico.",
        visibleCliente: true,
      },
    ],
    serviciosCotizados: [],
  },
];

export const getMotosByCliente = (clienteId) =>
  motosDemo.filter((m) => m.clienteId === clienteId);

export const getClienteById = (id) => clientesDemo.find((c) => c.id === id);
