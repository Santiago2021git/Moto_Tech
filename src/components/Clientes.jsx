import React from "react";
import { 
  Plus, Search, ChevronDown, Mail, 
  Phone, MapPin, Eye, Edit3 
} from "lucide-react";

export const Clientes = () => {
  // Datos ampliados para coincidir con la tarjeta del diseño
  const clientes = [
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
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Clientes</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra la base de datos de clientes</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
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
            placeholder="Buscar por nombre, email o teléfono..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todos los estados</option>
            <option>Activos</option>
            <option>Inactivos</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GRID DE TARJETAS DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente, i) => (
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
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                <Eye size={16} />
                Ver Detalles
              </button>
              <button className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors">
                <Edit3 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};