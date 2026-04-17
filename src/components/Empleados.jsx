import React from "react";
import { 
  Plus, Search, Star, Users, Award, TrendingUp, 
  ChevronDown
} from "lucide-react";

export const Empleados = () => {
  // Datos ampliados basados en el diseño de referencia
  const empleados = [
    {
      nombre: "Roberto Gómez",
      iniciales: "RG",
      rol: "Mecánico Senior",
      estado: "Ocupado",
      rating: 4.8,
      especialidades: ["Motor", "Transmisión", "Suspensión"],
      servicios: 342,
      eficiencia: 95,
      ingreso: "marzo de 2020",
      avatarColor: "from-blue-600 to-indigo-600",
    },
    {
      nombre: "Laura Sánchez",
      iniciales: "LS",
      rol: "Mecánica Junior",
      estado: "Disponible",
      rating: 4.6,
      especialidades: ["Mantenimiento", "Frenos", "Eléctrico"],
      servicios: 156,
      eficiencia: 88,
      ingreso: "junio de 2022",
      avatarColor: "from-purple-600 to-pink-600",
    },
    {
      nombre: "Carlos Ramírez",
      iniciales: "CR",
      rol: "Especialista Eléctrico",
      estado: "Inactivo",
      rating: 4.9,
      especialidades: ["Diagnóstico", "Inyección", "Sensores"],
      servicios: 512,
      eficiencia: 98,
      ingreso: "enero de 2019",
      avatarColor: "from-emerald-500 to-teal-600",
    },
    {
      nombre: "Andrés Torres",
      iniciales: "AT",
      rol: "Auxiliar de Taller",
      estado: "Disponible",
      rating: 4.2,
      especialidades: ["Llantas", "Fluidos", "Lavado"],
      servicios: 89,
      eficiencia: 75,
      ingreso: "noviembre de 2023",
      avatarColor: "from-orange-500 to-red-600",
    },
  ];

  // Helper para el color del estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Disponible': return 'bg-green-500';
      case 'Ocupado': return 'bg-yellow-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Personal</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra el equipo, métricas y asignaciones</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Empleado
        </button>
      </div>

      {/* KPI CARDS (Métricas de la parte superior) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">4</p>
            <p className="text-zinc-500 text-sm font-medium">En Turno</p>
          </div>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <Star size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">4.76</p>
            <p className="text-zinc-500 text-sm font-medium">Rating Promedio</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
            <Award size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">1,506</p>
            <p className="text-zinc-500 text-sm font-medium">Servicios Totales</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">92.8%</p>
            <p className="text-zinc-500 text-sm font-medium">Eficiencia</p>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o rol..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todos los roles</option>
            <option>Mecánicos</option>
            <option>Administrativos</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GRID DE EMPLEADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {empleados.map((emp, i) => (
          <div 
            key={i} 
            className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col group"
          >
            {/* HEADER TARJETA */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-inner`}>
                  {emp.iniciales}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{emp.nombre}</h3>
                  <p className="text-zinc-500 text-sm font-medium">{emp.rol}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(emp.estado)}`}></div>
                    <span className="text-xs text-zinc-400 font-medium">{emp.estado}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white font-bold text-sm">{emp.rating}</span>
              </div>
            </div>

            {/* ESPECIALIDADES */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {emp.especialidades.map((esp, index) => (
                  <span key={index} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                    {esp}
                  </span>
                ))}
              </div>
            </div>

            {/* MÉTRICAS (Servicios y Eficiencia) */}
            <div className="flex items-end justify-between mb-6 mt-auto">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Servicios Comp.</p>
                <p className="text-2xl font-black text-white">{emp.servicios}</p>
              </div>
              <div className="w-1/2">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Eficiencia</p>
                  <p className="text-sm font-bold text-white">{emp.eficiencia}%</p>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${emp.eficiencia}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* FOOTER (Ingreso y Botones) */}
            <div className="border-t border-zinc-800/80 pt-5">
              <p className="text-xs text-zinc-500 font-medium mb-4">
                En el equipo desde <span className="text-zinc-300">{emp.ingreso}</span>
              </p>
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">
                  Ver Perfil
                </button>
                <button className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Asignar Servicio
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};