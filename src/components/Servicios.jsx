import React from "react";
import { 
  Plus, Search, ChevronDown, Wrench, Clock, 
  Tag, Activity, List, Edit2, Trash2 
} from "lucide-react";

export const Servicios = () => {
  // Datos ampliados basados en el diseño de referencia
  const servicios = [
    {
      titulo: "Cambio de Aceite Completo",
      categoria: "Mantenimiento",
      descripcion: "Cambio de aceite de motor y filtro, incluye revisión de niveles.",
      duracion: "45 min",
      precio: "$50.000",
      incluye: ["Aceite 10W40", "Filtro de aceite"],
      popularidad: 95,
      color: "from-blue-600 to-indigo-600"
    },
    {
      titulo: "Mantenimiento General",
      categoria: "Mantenimiento",
      descripcion: "Revisión completa de sistemas, ajustes y lubricación.",
      duracion: "120 min",
      precio: "$120.000",
      incluye: ["Aceite", "Filtros", "Lubricantes"],
      popularidad: 88,
      color: "from-purple-600 to-pink-600"
    },
    {
      titulo: "Ajuste de Frenos",
      categoria: "Frenos",
      descripcion: "Revisión y ajuste del sistema de frenos, incluye pastillas.",
      duracion: "60 min",
      precio: "$80.000",
      incluye: ["Pastillas de freno"],
      popularidad: 75,
      color: "from-emerald-500 to-teal-600"
    },
    {
      titulo: "Sincronización de Motor",
      categoria: "Motor",
      descripcion: "Limpieza de inyectores, cambio de bujías y escáner.",
      duracion: "90 min",
      precio: "$150.000",
      incluye: ["Bujías", "Limpiador"],
      popularidad: 60,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Servicios del Taller</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestiona los servicios ofrecidos, costos y tiempos estimados</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Servicio
        </button>
      </div>

      {/* KPI CARDS (Métricas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <List size={16} />
            <p className="text-sm font-medium">Total Servicios</p>
          </div>
          <p className="text-3xl font-black text-white">8</p>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Tag size={16} />
            <p className="text-sm font-medium">Precio Promedio</p>
          </div>
          <p className="text-3xl font-black text-white">$93.125</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Clock size={16} />
            <p className="text-sm font-medium">Tiempo Promedio</p>
          </div>
          <p className="text-3xl font-black text-white">77 min</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Activity size={16} />
            <p className="text-sm font-medium">Categorías</p>
          </div>
          <p className="text-3xl font-black text-white">7</p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar servicios..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todas las categorías</option>
            <option>Mantenimiento</option>
            <option>Frenos</option>
            <option>Motor</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GRID DE SERVICIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicios.map((servicio, i) => (
          <div 
            key={i} 
            className="bg-zinc-950 border border-zinc-800 hover:border-purple-500/30 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col group relative overflow-hidden"
          >
            {/* HEADER TARJETA */}
            <div className="flex gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${servicio.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                <Wrench size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  {servicio.titulo}
                </h3>
                <span className="inline-block bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-medium border border-zinc-800">
                  {servicio.categoria}
                </span>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed line-clamp-2">
              {servicio.descripcion}
            </p>

            {/* INFO TIEMPO Y PRECIO */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800/50">
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock size={18} className="text-zinc-500" />
                <span className="font-medium">{servicio.duracion}</span>
              </div>
              <div className="text-xl font-black text-white">
                {servicio.precio}
              </div>
            </div>

            {/* INCLUYE (TAGS) */}
            <div className="mb-6 flex-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Incluye:</p>
              <div className="flex flex-wrap gap-2">
                {servicio.incluye.map((item, index) => (
                  <span key={index} className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-purple-500/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* POPULARIDAD */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Popularidad</p>
                <span className="text-xs font-bold text-zinc-400">{servicio.popularidad}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${servicio.popularidad}%` }}
                ></div>
              </div>
            </div>

            {/* FOOTER (Botones de Acción) */}
            <div className="flex items-center gap-3 pt-2 mt-auto">
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">
                <Edit2 size={16} />
                Editar
              </button>
              <button className="flex items-center justify-center w-11 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20">
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};