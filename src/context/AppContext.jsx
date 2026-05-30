import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  serviciosEstandarCO,
  seedSuperUsuario,
  seedTaller,
  seedUsuariosCliente,
  seedClientes,
  seedVehiculos,
  seedEmpleados,
  seedInventario,
  seedProveedores,
  seedCitas,
  seedNotificaciones,
} from "../data/seedDemo";

const AppContext = createContext(null);
// v4: ajustes de UI (responsive super, theme, repuestos + inventario, sin MotoTech demo)
const STORAGE_KEY = "mototech_data_v4";

const COLORS_PALETTE = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

// Catálogo demo del taller principal (con tallerId)
const seedServicios = serviciosEstandarCO.map((s, i) => ({
  id: `srv-vm-${i + 1}`,
  tallerId: seedTaller.id,
  ...s,
  popularidad: 40 + (i * 5) % 50,
  color: COLORS_PALETTE[i % COLORS_PALETTE.length],
}));

const initialData = {
  talleres: [seedSuperUsuario, seedTaller],
  usuariosCliente: seedUsuariosCliente,
  vehiculos: seedVehiculos,
  clientes: seedClientes,
  empleados: seedEmpleados,
  inventario: seedInventario,
  servicios: seedServicios,
  proveedores: seedProveedores,
  citas: seedCitas,
  notificaciones: seedNotificaciones,
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    const parsed = JSON.parse(raw);
    return { ...initialData, ...parsed };
  } catch {
    return initialData;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* cuota o privacidad — falla silenciosa */
  }
}

const newId = (prefix = "id") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function AppProvider({ children }) {
  const persisted = loadFromStorage();

  const [talleres, setTalleres]                 = useState(persisted.talleres);
  const [usuariosCliente, setUsuariosCliente]   = useState(persisted.usuariosCliente);
  const [vehiculos, setVehiculos]               = useState(persisted.vehiculos);
  const [clientes, setClientes]                 = useState(persisted.clientes);
  const [empleados, setEmpleados]               = useState(persisted.empleados);
  const [inventario, setInventario]             = useState(persisted.inventario);
  const [servicios, setServicios]               = useState(persisted.servicios);
  const [proveedores, setProveedores]           = useState(persisted.proveedores);
  const [citas, setCitas]                       = useState(persisted.citas);
  const [notificaciones, setNotificaciones]     = useState(persisted.notificaciones);

  useEffect(() => {
    saveToStorage({
      talleres, usuariosCliente, vehiculos, clientes,
      empleados, inventario, servicios, proveedores, citas, notificaciones,
    });
  }, [talleres, usuariosCliente, vehiculos, clientes, empleados, inventario, servicios, proveedores, citas, notificaciones]);

  // ── Talleres ────────────────────────────────────────────────────────────
  const registrarTaller = (taller) => {
    const id = newId("taller");
    const nuevo = {
      id,
      logoEmoji: "🔧",
      color: "cyan",
      iniciales: (taller.nombre || "").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "TL",
      anioFundacion: new Date().getFullYear(),
      descripcion: "",
      logoBase64: null,
      ...taller,
      usuario: taller.email,
    };
    setTalleres((prev) => [...prev, nuevo]);

    // Auto-siembra el catálogo de servicios estándar para el nuevo taller
    const nuevosServicios = serviciosEstandarCO.map((s, i) => ({
      id: `srv-${id}-${i}`,
      tallerId: id,
      ...s,
      popularidad: 30,
      color: COLORS_PALETTE[i % COLORS_PALETTE.length],
    }));
    setServicios((prev) => [...prev, ...nuevosServicios]);
    return nuevo;
  };

  const actualizarTaller = (id, cambios) =>
    setTalleres((prev) => prev.map((t) => (t.id === id ? { ...t, ...cambios } : t)));

  // ── Usuarios cliente ────────────────────────────────────────────────────
  const registrarCliente = (cliente) => {
    const nuevo = {
      id: newId("cli"),
      tallerId: cliente.tallerId || talleres.find((t) => !t.isSuper)?.id,
      iniciales: (cliente.nombre || "").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "CL",
      ...cliente,
    };
    setUsuariosCliente((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const actualizarUsuarioCliente = (id, cambios) =>
    setUsuariosCliente((prev) => prev.map((u) => (u.id === id ? { ...u, ...cambios } : u)));

  // ── Vehículos ───────────────────────────────────────────────────────────
  const agregarVehiculo = (vehiculo) => {
    const id = newId("veh");
    const nuevo = {
      id,
      ingreso: new Date().toISOString().slice(0, 10),
      entregaEstimada: "",
      tecnico: "Por asignar",
      diagnostico: "",
      ordenServicio: `OS-${Date.now().toString().slice(-6)}`,
      avance: 0,
      historial: [{
        titulo: "Moto recibida",
        descripcion: "Ingreso al taller.",
        fecha: new Date().toISOString().slice(0, 10),
        visibleCliente: true,
      }],
      serviciosCotizados: [],
      color: "",
      servicios: 0,
      reporteEntrega: null,
      estado: "Sin Atender",
      ...vehiculo,
    };
    setVehiculos((prev) => [...prev, nuevo]);

    // Auto-crea ficha de cliente si no existe (por usuarioId o por nombre)
    if (vehiculo.clienteUsuarioId) {
      setClientes((prev) => {
        const existe = prev.some((c) => c.usuarioId === vehiculo.clienteUsuarioId);
        if (existe) return prev;
        const usr = usuariosCliente.find((u) => u.id === vehiculo.clienteUsuarioId);
        if (!usr) return prev;
        return [...prev, {
          id: newId("clt"),
          tallerId: vehiculo.tallerId,
          usuarioId: usr.id,
          nombre: usr.nombre,
          iniciales: usr.iniciales,
          telefono: usr.telefono || "",
          email: usr.email || "",
          direccion: usr.direccion || "",
          estado: "Activo",
          avatarColor: "from-blue-600 to-blue-400",
          vehiculos: 1, gastado: "$0",
          ultimaVisita: new Date().toLocaleDateString("es-CO"),
        }];
      });
    } else if (vehiculo.cliente?.trim()) {
      setClientes((prev) => {
        const existe = prev.some(
          (c) => c.tallerId === vehiculo.tallerId &&
                 c.nombre.toLowerCase() === vehiculo.cliente.toLowerCase()
        );
        if (existe) return prev;
        return [...prev, {
          id: newId("clt"),
          tallerId: vehiculo.tallerId,
          nombre: vehiculo.cliente,
          iniciales: vehiculo.cliente.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
          telefono: vehiculo.telefono || "",
          email: "", direccion: "",
          estado: "Activo",
          avatarColor: "from-blue-600 to-blue-400",
          vehiculos: 1, gastado: "$0",
          ultimaVisita: new Date().toLocaleDateString("es-CO"),
        }];
      });
    }
    return nuevo;
  };

  const actualizarVehiculo = (id, cambios) =>
    setVehiculos((prev) => prev.map((v) => (v.id === id ? { ...v, ...cambios } : v)));

  const eliminarVehiculo = (id) =>
    setVehiculos((prev) => prev.filter((v) => v.id !== id));

  // Finaliza un vehículo: cambia estado + guarda reporte + notifica al cliente
  const finalizarVehiculo = (vehiculoId, reporte) => {
    let vehObj = null;
    setVehiculos((prev) =>
      prev.map((v) => {
        if (v.id !== vehiculoId) return v;
        vehObj = {
          ...v,
          estado: "Finalizada",
          avance: 100,
          reporteEntrega: {
            ...reporte,
            fecha: reporte.fecha || new Date().toISOString().slice(0, 10),
          },
          historial: [...(v.historial || []), {
            titulo: "Servicio finalizado",
            descripcion: reporte.descripcion || "Servicio completado.",
            fecha: new Date().toISOString().slice(0, 10),
            visibleCliente: true,
          }],
        };
        return vehObj;
      })
    );
    if (vehObj?.clienteUsuarioId) {
      const noti = {
        id: newId("ntf"),
        clienteUsuarioId: vehObj.clienteUsuarioId,
        tipo: "completado",
        titulo: "Tu moto está lista",
        mensaje: `El taller terminó el servicio de tu ${vehObj.marca} ${vehObj.modelo}. Ya puedes ver el reporte de entrega y recogerla.`,
        fecha: new Date().toISOString(),
        leida: false,
        vehiculoId: vehObj.id,
      };
      setNotificaciones((prev) => [noti, ...prev]);
    }
  };

  // ── Clientes (fichas del taller) ────────────────────────────────────────
  const agregarCliente = (cliente) =>
    setClientes((prev) => [...prev, { id: newId("clt"), estado: "Activo", ...cliente }]);

  const actualizarCliente = (id, cambios) =>
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...cambios } : c)));

  const eliminarCliente = (id) =>
    setClientes((prev) => prev.filter((c) => c.id !== id));

  // ── Empleados ───────────────────────────────────────────────────────────
  const agregarEmpleado = (emp) =>
    setEmpleados((prev) => [...prev, { id: newId("emp"), ...emp }]);

  const actualizarEmpleado = (id, cambios) =>
    setEmpleados((prev) => prev.map((e) => (e.id === id ? { ...e, ...cambios } : e)));

  const eliminarEmpleado = (id) =>
    setEmpleados((prev) => prev.filter((e) => e.id !== id));

  // Asigna un vehículo (servicio activo) a un empleado del taller
  const asignarVehiculoAEmpleado = (vehiculoId, empleadoNombre) =>
    actualizarVehiculo(vehiculoId, { tecnico: empleadoNombre, estado: "En Proceso" });

  // ── Inventario ──────────────────────────────────────────────────────────
  const agregarItem = (item) =>
    setInventario((prev) => [...prev, { id: newId("itm"), ...item }]);

  const actualizarItem = (id, cambios) =>
    setInventario((prev) => prev.map((i) => (i.id === id ? { ...i, ...cambios } : i)));

  const eliminarItem = (id) =>
    setInventario((prev) => prev.filter((i) => i.id !== id));

  // Descuenta stock por nombre o por id; retorna true si se descontó
  const descontarStock = (matcher, cantidad = 1, tallerId) => {
    let ok = false;
    setInventario((prev) => prev.map((it) => {
      if (ok) return it;
      if (tallerId && it.tallerId && it.tallerId !== tallerId) return it;
      const matchById = matcher.id && it.id === matcher.id;
      const matchByName = matcher.nombre && it.nombre?.toLowerCase() === matcher.nombre.toLowerCase();
      if (matchById || matchByName) {
        const restante = Math.max(0, Number(it.stock || 0) - Number(cantidad || 1));
        ok = true;
        return { ...it, stock: restante };
      }
      return it;
    }));
    return ok;
  };

  // ── Servicios ───────────────────────────────────────────────────────────
  const agregarServicio = (s) =>
    setServicios((prev) => [...prev, { id: newId("srv"), popularidad: 0, ...s }]);

  const actualizarServicio = (id, cambios) =>
    setServicios((prev) => prev.map((s) => (s.id === id ? { ...s, ...cambios } : s)));

  const eliminarServicio = (id) =>
    setServicios((prev) => prev.filter((s) => s.id !== id));

  // ── Proveedores ─────────────────────────────────────────────────────────
  const agregarProveedor = (p) =>
    setProveedores((prev) => [...prev, { id: newId("prv"), ...p }]);

  const actualizarProveedor = (id, cambios) =>
    setProveedores((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));

  const eliminarProveedor = (id) =>
    setProveedores((prev) => prev.filter((p) => p.id !== id));

  // ── Citas ───────────────────────────────────────────────────────────────
  const agregarCita = (cita) =>
    setCitas((prev) => [...prev, { id: newId("cit"), confirmada: false, ...cita }]);

  const actualizarCita = (id, cambios) =>
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, ...cambios } : c)));

  const eliminarCita = (id) =>
    setCitas((prev) => prev.filter((c) => c.id !== id));

  // ── Notificaciones ──────────────────────────────────────────────────────
  const agregarNotificacion = (n) =>
    setNotificaciones((prev) => [
      { id: newId("ntf"), fecha: new Date().toISOString(), leida: false, ...n },
      ...prev,
    ]);

  const marcarNotificacionLeida = (id) =>
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));

  const marcarTodasLeidas = (filtro = {}) =>
    setNotificaciones((prev) =>
      prev.map((n) => {
        if (filtro.tallerId && n.tallerId !== filtro.tallerId) return n;
        if (filtro.clienteUsuarioId && n.clienteUsuarioId !== filtro.clienteUsuarioId) return n;
        return { ...n, leida: true };
      })
    );

  const eliminarNotificacion = (id) =>
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));

  // ── Stats derivadas ─────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    totalVehiculos: vehiculos.length,
    sinAtender: vehiculos.filter((v) => v.estado === "Sin Atender").length,
    enProceso: vehiculos.filter((v) => v.estado === "En Proceso").length,
    finalizados: vehiculos.filter((v) => v.estado === "Finalizada").length,
    totalClientes: clientes.length,
    totalEmpleados: empleados.length,
    totalInventario: inventario.length,
    stockBajo: inventario.filter((i) => Number(i.stock) < Number(i.minStock)).length,
    citasHoy: citas.filter((c) => c.fecha === new Date().toISOString().slice(0, 10)).length,
    serviciosTotales: vehiculos.reduce((acc, v) => acc + (v.servicios || 0), 0),
    porMarca: vehiculos.reduce((acc, v) => { acc[v.marca] = (acc[v.marca] || 0) + 1; return acc; }, {}),
    porEstado: {
      "Sin Atender": vehiculos.filter((v) => v.estado === "Sin Atender").length,
      "En Proceso":  vehiculos.filter((v) => v.estado === "En Proceso").length,
      "Finalizada":  vehiculos.filter((v) => v.estado === "Finalizada").length,
    },
  }), [vehiculos, clientes, empleados, inventario, citas]);

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTalleres(initialData.talleres);
    setUsuariosCliente(initialData.usuariosCliente);
    setVehiculos(initialData.vehiculos);
    setClientes(initialData.clientes);
    setEmpleados(initialData.empleados);
    setInventario(initialData.inventario);
    setServicios(initialData.servicios);
    setProveedores(initialData.proveedores);
    setCitas(initialData.citas);
    setNotificaciones(initialData.notificaciones);
  };

  const value = {
    talleres, registrarTaller, actualizarTaller,
    usuariosCliente, registrarCliente, actualizarUsuarioCliente,
    vehiculos, agregarVehiculo, actualizarVehiculo, eliminarVehiculo, finalizarVehiculo,
    clientes, agregarCliente, actualizarCliente, eliminarCliente,
    empleados, agregarEmpleado, actualizarEmpleado, eliminarEmpleado, asignarVehiculoAEmpleado,
    inventario, agregarItem, actualizarItem, eliminarItem, descontarStock,
    servicios, agregarServicio, actualizarServicio, eliminarServicio,
    proveedores, agregarProveedor, actualizarProveedor, eliminarProveedor,
    citas, agregarCita, actualizarCita, eliminarCita,
    notificaciones, agregarNotificacion, marcarNotificacionLeida, marcarTodasLeidas, eliminarNotificacion,
    stats,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
