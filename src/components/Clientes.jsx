import React, { useState } from "react";
import { 
  Plus, Search, ChevronDown, Mail, 
  Phone, MapPin, Eye, Edit3, X, Check, AlertCircle
} from "lucide-react";
import { usePageTitle } from '../hooks/usePageTitle';

const AVATAR_COLORS = [
  "from-blue-600 to-blue-400",
  "from-purple-600 to-purple-400",
  "from-indigo-600 to-indigo-400",
  "from-emerald-600 to-teal-400",
  "from-orange-500 to-red-500",
];

const initialForm = { nombre: "", email: "", telefono: "", direccion: "" };

export const Clientes = () => {
  usePageTitle("Clientes");
  const [clientes, setClientes] = useState([
    {
      nombre: "Carlos Rodríguez",
      iniciales: "CR",
      estado: "Activo",
      email: "carlos.r@email.com",
      telefono: "+57 312 345 6789",
      direccion: "Calle 50 #25-30, Bogotá",
      vehiculos: 2,
      gastado: "$1250k",
      ultimaVisita: "19/2/2026",
      avatarColor: "from-blue-600 to-blue-400",
    },
    {
      nombre: "María Fernández",
      iniciales: "MF",
      estado: "Activo",
      email: "maria.f@email.com",
      telefono: "+57 315 987 6543",
      direccion: "Carrera 15 #80-45, Medellín",
      vehiculos: 1,
      gastado: "$850k",
      ultimaVisita: "17/2/2026",
      avatarColor: "from-purple-600 to-purple-400",
    },
    {
      nombre: "Juan Pérez",
      iniciales: "JP",
      estado: "Inactivo",
      email: "juan.p@email.com",
      telefono: "+57 301 234 5678",
      direccion: "Avenida 68 #45-12, Cali",
      vehiculos: 3,
      gastado: "$2100k",
      ultimaVisita: "14/1/2026",
      avatarColor: "from-indigo-600 to-indigo-400",
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos los estados");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [detalleCliente, setDetalleCliente] = useState(null);

  // ── Filtrado ──
  const clientesFiltrados = clientes.filter((c) => {
    const termino = busqueda.toLowerCase();
    const coincide =
      c.nombre.toLowerCase().includes(termino) ||
      c.email.toLowerCase().includes(termino) ||
      c.telefono.includes(termino);
    const estadoOk =
      filtroEstado === "Todos los estados" || c.estado === filtroEstado.replace("s", "").replace("Activo", "Activo").replace("Inactivo", "Inactivo") ||
      (filtroEstado === "Activos" && c.estado === "Activo") ||
      (filtroEstado === "Inactivos" && c.estado === "Inactivo");
    return coincide && estadoOk;
  });

  // ── Validación ──
  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.email.trim()) {
      e.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Ingresa un email válido.";
    }
    if (!form.telefono.trim()) {
      e.telefono = "El teléfono es obligatorio.";
    } else if (!/^[\d\s+\-()]{7,}$/.test(form.telefono)) {
      e.telefono = "Ingresa un teléfono válido.";
    }
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria.";
    return e;
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setForm({
        nombre: clientes[index].nombre,
        email: clientes[index].email,
        telefono: clientes[index].telefono,
        direccion: clientes[index].direccion,
      });
      setEditIndex(index);
    } else {
      setForm(initialForm);
      setEditIndex(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const iniciales = form.nombre.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
    if (editIndex !== null) {
      setClientes(prev => prev.map((c, i) => i === editIndex
        ? { ...c, nombre: form.nombre, iniciales, email: form.email, telefono: form.telefono, direccion: form.direccion }
        : c
      ));
      showToast("Cliente actualizado correctamente.");
    } else {
      const nuevo = {
        nombre: form.nombre,
        iniciales,
        estado: "Activo",
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        vehiculos: 0,
        gastado: "$0",
        ultimaVisita: new Date().toLocaleDateString("es-CO"),
        avatarColor: AVATAR_COLORS[clientes.length % AVATAR_COLORS.length],
      };
      setClientes(prev => [...prev, nuevo]);
      showToast("Cliente registrado correctamente.");
    }
    closeModal();
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="animate-in space-y-8 pb-10">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl animate-in">
          <Check size={18} />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR CLIENTE */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">
                {editIndex !== null ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Nombre completo *
                </label>
                <input
                  value={form.nombre}
                  onChange={handleChange("nombre")}
                  placeholder="Ej: Carlos Rodríguez"
                  className={`w-full bg-zinc-900 border ${errors.nombre ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                />
                {errors.nombre && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.nombre}</p>}
              </div>
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email *
                </label>
                <input
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="Ej: correo@email.com"
                  type="email"
                  className={`w-full bg-zinc-900 border ${errors.email ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
              </div>
              {/* Teléfono */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Teléfono *
                </label>
                <input
                  value={form.telefono}
                  onChange={handleChange("telefono")}
                  placeholder="Ej: +57 312 345 6789"
                  className={`w-full bg-zinc-900 border ${errors.telefono ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                />
                {errors.telefono && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.telefono}</p>}
              </div>
              {/* Dirección */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Dirección *
                </label>
                <input
                  value={form.direccion}
                  onChange={handleChange("direccion")}
                  placeholder="Ej: Calle 50 #25-30, Bogotá"
                  className={`w-full bg-zinc-900 border ${errors.direccion ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                />
                {errors.direccion && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.direccion}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? "Guardar Cambios" : "Registrar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLES */}
      {detalleCliente && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Detalle del Cliente</h3>
              <button onClick={() => setDetalleCliente(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${detalleCliente.avatarColor} flex items-center justify-center text-white font-black text-2xl mb-4`}>
              {detalleCliente.iniciales}
            </div>
            <h4 className="text-white font-bold text-lg mb-1">{detalleCliente.nombre}</h4>
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-5 ${detalleCliente.estado === "Activo" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>
              {detalleCliente.estado}
            </span>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm text-zinc-400"><Mail size={15} className="text-zinc-500" />{detalleCliente.email}</div>
              <div className="flex items-center gap-3 text-sm text-zinc-400"><Phone size={15} className="text-zinc-500" />{detalleCliente.telefono}</div>
              <div className="flex items-center gap-3 text-sm text-zinc-400"><MapPin size={15} className="text-zinc-500" />{detalleCliente.direccion}</div>
            </div>
            <div className="flex justify-between bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-6">
              <div><p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Vehículos</p><p className="text-xl font-black text-white">{detalleCliente.vehiculos}</p></div>
              <div className="h-8 w-px bg-zinc-800 self-center"></div>
              <div className="text-right"><p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Gastado</p><p className="text-xl font-black text-white">{detalleCliente.gastado}</p></div>
            </div>
            <button onClick={() => setDetalleCliente(null)} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl font-bold text-sm transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Clientes</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra la base de datos de clientes</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Nuevo Cliente
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS (Búsqueda y Filtros) */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm"
          >
            <option>Todos los estados</option>
            <option>Activos</option>
            <option>Inactivos</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Sin resultados */}
      {clientesFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron clientes</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda o filtro.</p>
        </div>
      )}

      {/* GRID DE TARJETAS DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map((cliente, i) => (
          <div 
            key={i} 
            className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/10 transition-all group"
          >
            {/* HEADER TARJETA (Avatar, Nombre, Estado) */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cliente.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-inner shrink-0`}>
                {cliente.iniciales}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-white font-bold text-lg leading-tight truncate">
                  {cliente.nombre}
                </h3>
                <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                  cliente.estado === 'Activo' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {cliente.estado}
                </span>
              </div>
            </div>

            {/* INFORMACIÓN DE CONTACTO */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail size={16} className="text-zinc-500 shrink-0" />
                <span className="truncate">{cliente.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone size={16} className="text-zinc-500 shrink-0" />
                <span>{cliente.telefono}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <MapPin size={16} className="text-zinc-500 shrink-0" />
                <span className="truncate">{cliente.direccion}</span>
              </div>
            </div>

            {/* CAJA DE ESTADÍSTICAS */}
            <div className="bg-zinc-900/50 rounded-2xl p-4 flex items-center justify-between border border-zinc-800/50 mb-4">
              <div>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Vehículos</p>
                <p className="text-xl font-black text-white">{cliente.vehiculos}</p>
              </div>
              <div className="h-8 w-px bg-zinc-800"></div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Gastado</p>
                <p className="text-xl font-black text-white">{cliente.gastado}</p>
              </div>
            </div>

            {/* ÚLTIMA VISITA */}
            <div className="text-xs font-medium text-zinc-500 mb-6 text-center">
              Última visita: <span className="text-zinc-400">{cliente.ultimaVisita}</span>
            </div>

            {/* ACCIONES (Footer de la tarjeta) */}
            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/80">
              <button
                onClick={() => setDetalleCliente(cliente)}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                <Eye size={16} />
                Ver Detalles
              </button>
              <button
                onClick={() => openModal(clientes.indexOf(cliente))}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
                title="Editar cliente"
              >
                <Edit3 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};