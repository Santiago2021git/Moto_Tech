import React, { useState } from 'react';
import { 
  Plus, CalendarDays, CheckCircle2, Clock, 
  ChevronRight, Calendar as CalendarIcon 
} from 'lucide-react';

export const Agenda = () => {
  const [selectedDay, setSelectedDay] = useState('lunes');

  const stats = [
    { label: 'Total Citas', value: '3', icon: CalendarDays, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Confirmadas', value: '1', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pendientes', value: '2', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  const dias = [
    { id: 'lunes', nombre: 'lunes', fecha: '2 de marzo' },
    { id: 'martes', nombre: 'martes', fecha: '3 de marzo' },
    { id: 'miercoles', nombre: 'miércoles', fecha: '4 de marzo' },
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Agenda de Citas</h2>
          <p className="text-zinc-500 mt-1 font-medium">Programa y gestiona las citas del taller</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nueva Cita
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENEDOR PRINCIPAL: CALENDARIO LATERAL + VISTA DIARIA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SELECTOR DE DÍAS (IZQUIERDA) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-4 space-y-2">
            <div className="flex items-center gap-2 px-4 py-2 text-zinc-400 mb-2">
              <CalendarIcon size={18} />
              <span className="font-bold text-xs uppercase tracking-widest">Semana</span>
            </div>
            {dias.map((dia) => (
              <button
                key={dia.id}
                onClick={() => setSelectedDay(dia.id)}
                className={`w-full flex flex-col items-start px-5 py-4 rounded-2xl transition-all ${
                  selectedDay === dia.id 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 scale-[1.02]' 
                  : 'bg-transparent text-zinc-500 hover:bg-zinc-900'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedDay === dia.id ? 'text-purple-200' : 'text-zinc-600'}`}>
                  {dia.nombre}
                </span>
                <span className="text-base font-bold">{dia.fecha}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VISTA DE CITAS DEL DÍA (DERECHA) */}
        <div className="lg:col-span-9">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              Citas para {dias.find(d => d.id === selectedDay)?.nombre}, {dias.find(d => d.id === selectedDay)?.fecha}
            </h3>

            {/* ESTADO VACÍO (Como en la imagen de referencia) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-zinc-800 shadow-inner">
                <CalendarIcon size={40} className="text-zinc-700" />
              </div>
              <div>
                <p className="text-zinc-500 font-bold text-lg">No hay citas programadas para este día</p>
                <p className="text-zinc-600 text-sm mt-1">Las nuevas citas que agendes aparecerán en este listado.</p>
              </div>
              <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95">
                <Plus size={18} />
                Programar Cita
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};