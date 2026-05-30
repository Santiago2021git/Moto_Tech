import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "mototech_data";

const initialData = {
  vehiculos: [
    { id: 1, placa: "ABC123", marca: "Honda",    modelo: "CBR 600RR", cliente: "Carlos Martínez", telefono: "+57 310 456 7890", año: "2022", estado: "En Proceso",  ingreso: "hace 10 días", servicios: 1 },
    { id: 2, placa: "XYZ789", marca: "Yamaha",   modelo: "MT-07",     cliente: "Laura Gómez",     telefono: "+57 320 789 4561", año: "2021", estado: "Sin Atender", ingreso: "hace 8 días",  servicios: 1 },
    { id: 3, placa: "DEF456", marca: "Kawasaki", modelo: "Z900",      cliente: "Andrés Herrera",  telefono: "+57 315 234 5678", año: "2023", estado: "Finalizada",  ingreso: "hace 3 días",  servicios: 2 },
  ],
  clientes: [
    { id: 1, nombre: "Carlos Martínez", telefono: "+57 310 456 7890", email: "carlos@email.com" },
    { id: 2, nombre: "Laura Gómez",     telefono: "+57 320 789 4561", email: "laura@email.com"  },
    { id: 3, nombre: "Andrés Herrera",  telefono: "+57 315 234 5678", email: "andres@email.com" },
  ],
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    const parsed = JSON.parse(raw);
    // Asegura que existan todas las claves aunque el storage sea antiguo
    return { ...initialData, ...parsed };
  } catch {
    return initialData;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // cuota excedida u otro error — falla silenciosamente
  }
}

export function AppProvider({ children }) {
  const [vehiculos, setVehiculos] = useState(() => loadFromStorage().vehiculos);
  const [clientes,  setClientes]  = useState(() => loadFromStorage().clientes);

  // Persiste cada vez que cambia vehiculos o clientes
  useEffect(() => {
    saveToStorage({ vehiculos, clientes });
  }, [vehiculos, clientes]);

  // ── Vehículos ──────────────────────────────────────────────────────────────
  const agregarVehiculo = (vehiculo) => {
    const nuevo = { ...vehiculo, id: Date.now(), ingreso: "recién ingresado", servicios: 0 };
    setVehiculos(prev => [...prev, nuevo]);

    // Si el cliente no existe, lo crea automáticamente
    if (vehiculo.cliente.trim()) {
      setClientes(prev => {
        const existe = prev.some(c =>
          c.nombre.toLowerCase() === vehiculo.cliente.toLowerCase()
        );
        if (existe) return prev;
        return [...prev, {
          id: Date.now() + 1,
          nombre: vehiculo.cliente,
          telefono: vehiculo.telefono || "",
          email: "",
        }];
      });
    }
  };

  const actualizarVehiculo = (id, cambios) => {
    setVehiculos(prev => prev.map(v => v.id === id ? { ...v, ...cambios } : v));
  };

  const eliminarVehiculo = (id) => {
    setVehiculos(prev => prev.filter(v => v.id !== id));
  };

  // ── Clientes ───────────────────────────────────────────────────────────────
  const agregarCliente = (cliente) => {
    setClientes(prev => [...prev, { ...cliente, id: Date.now() }]);
  };

  const actualizarCliente = (id, cambios) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...cambios } : c));
  };

  const eliminarCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  // ── Stats derivadas (usadas por Dashboard y Reportes) ─────────────────────
  const stats = {
    totalVehiculos:    vehiculos.length,
    sinAtender:        vehiculos.filter(v => v.estado === "Sin Atender").length,
    enProceso:         vehiculos.filter(v => v.estado === "En Proceso").length,
    finalizados:       vehiculos.filter(v => v.estado === "Finalizada").length,
    totalClientes:     clientes.length,
    serviciosTotales:  vehiculos.reduce((acc, v) => acc + (v.servicios || 0), 0),
    // Distribución por marca para reportes
    porMarca: vehiculos.reduce((acc, v) => {
      acc[v.marca] = (acc[v.marca] || 0) + 1;
      return acc;
    }, {}),
  };

  return (
    <AppContext.Provider value={{
      vehiculos, agregarVehiculo, actualizarVehiculo, eliminarVehiculo,
      clientes,  agregarCliente,  actualizarCliente,  eliminarCliente,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook de acceso rápido
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}