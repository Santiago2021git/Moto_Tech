import React, { useState } from 'react';
import { Plus, Search, Bike, Clock, Phone, Wrench, MoreVertical } from 'lucide-react';
// Importamos el componente de detalle
import { DetalleVehiculo } from './DetalleVehiculo';

export const Vehiculos = () => {
  // ESTADO PARA NAVEGACIÓN INTERNA
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [filter, setFilter] = useState('Todos');

  const vehiculos = [
    { 
      id: 1, 
      placa: 'ABC123', 
      marca: 'Honda', 
      modelo: 'CBR 600RR', 
      cliente: 'Carlos Martínez', 
      telefono: '+57 310 456 7890',
      año: '2022',
      estado: 'En Proceso', 
      ingreso: 'hace 10 días',
      servicios: 1
    },
    { 
      id: 2, 
      placa: 'XYZ789', 
      marca: 'Yamaha', 
      modelo: 'MT-07', 
      cliente: 'Laura Gómez', 
      telefono: '+57 320 789 4561',
      año: '2021',
      estado: 'Sin Atender', 
      ingreso: 'hace 8 días',
      servicios: 1
    }
  ];

  // SI HAY UN VEHÍCULO SELECCIONADO, MOSTRAR DETALLE
  if (vehiculoSeleccionado) {
    return (
      <DetalleVehiculo 
        vehiculo={vehiculoSeleccionado} 
        onBack={() => setVehiculoSeleccionado(null)} 
      />
    );
  }

  // SI NO, MOSTRAR LISTA DE VEHÍCULOS
  return (
    <div className="animate-in space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Vehículos</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestión de motos en el taller</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Vehículo
        </button>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-3xl flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por placa, propietario..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 text-zinc-300 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['Todos', 'Sin Atender', 'En Proceso', 'Finalizadas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                filter === cat 
                ? 'bg-white text-black' 
                : 'bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehiculos.map((v) => (
          <div 
            key={v.id} 
            onClick={() => setVehiculoSeleccionado(v)} // <--- AQUÍ SE ACTIVA LA NAVEGACIÓN
            className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Bike size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight">{v.marca} {v.modelo}</h3>
                  <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Placa: <span className="text-zinc-300">{v.placa}</span></p>
                </div>
              </div>

              <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                v.estado === 'En Proceso' 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                {v.estado}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Propietario</p>
                <p className="text-zinc-200 font-semibold">{v.cliente}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Año</p>
                <p className="text-zinc-200 font-semibold">{v.año}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900 flex justify-between items-center text-zinc-500 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{v.ingreso}</span>
              </div>
              <div className="text-blue-500 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver detalle <MoreVertical size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};