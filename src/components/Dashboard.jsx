import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Wrench,
  CheckCircle2,
  Calendar,
  Bike,
  User,
  Clock,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Sin Atender", value: "1", sub: "Vehículos en espera", icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", route: "/vehiculos" },
    { label: "En Proceso", value: "1", sub: "Trabajos en curso", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", route: "/vehiculos" },
    { label: "Finalizados", value: "1", sub: "Esta semana", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", route: "/vehiculos" },
    { label: "Citas Hoy", value: "0", sub: "Programadas", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10", route: "/agenda" },
  ];

  return (
    <div className="space-y-8 animate-in">
      
      {/* HEADER IDÉNTICO A LA IMAGEN */}
      <div>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Dashboard
        </h2>
        <p className="text-zinc-500 text-lg mt-1 font-medium">
          Resumen general del taller
        </p>
      </div>

      {/* STATS CARDS - Diseño con icono a la derecha arriba como en la foto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => navigate(stat.route)}
            className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 hover:border-zinc-700 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-zinc-400 mb-6 uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-5xl font-black text-white mb-2">
                  {stat.value}
                </h3>
              </div>
              <div className={`${stat.color} p-1`}>
                <stat.icon size={28} strokeWidth={2} />
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              {stat.sub}
            </p>
            <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={16} className="text-zinc-600" />
            </div>
          </div>
        ))}
      </div>

      {/* GRID INFERIOR (2 COLUMNAS) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SECCIÓN: VEHÍCULOS SIN ATENDER (IZQUIERDA) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-orange-400 px-2">
            <Clock size={24} strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Vehículos Sin Atender
            </h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 group hover:border-orange-500/30 transition-all">
             <div className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-6 relative">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                   <Clock size={12} />
                   hace 8 días
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <div className="bg-orange-500 text-black p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                    <Bike size={32} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white">Yamaha MT-07</h4>
                    <p className="text-zinc-400 text-sm font-medium">Placa: <span className="text-zinc-100 font-mono">XYZ789</span></p>
                    <p className="text-zinc-400 text-sm font-medium">Propietario: <span className="text-zinc-100">Laura Gómez</span></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/vehiculos')}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Bike size={15} /> Ver Vehículo
                  </button>
                  <button
                    onClick={() => navigate('/vehiculos')}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    <Wrench size={15} /> Iniciar Servicio
                  </button>
                </div>
             </div>
          </div>
        </section>

        {/* SECCIÓN: PRÓXIMAS CITAS (DERECHA) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-purple-400 px-2">
            <Calendar size={24} strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Próximas Citas
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { name: "Ana Silva", plate: "GHI789", task: "Mantenimiento general", date: "24 feb", time: "09:00" },
              { name: "Pedro Sánchez", plate: "JKL012", task: "Reparación de escape", date: "24 feb", time: "14:00" },
            ].map((cita, i) => (
              <div
                key={i}
                onClick={() => navigate('/agenda')}
                className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 flex items-center justify-between hover:bg-zinc-900 transition-all border-l-4 border-l-purple-600 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{cita.name}</h4>
                    <p className="text-xs text-zinc-500 font-mono mb-1">{cita.plate}</p>
                    <p className="text-xs text-purple-400 font-bold italic">
                      {cita.task}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-purple-400">
                    {cita.date}
                  </p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    {cita.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};