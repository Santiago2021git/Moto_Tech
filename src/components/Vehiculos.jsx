import React, { useState } from 'react';
import {
  Plus, Search, Bike, Clock, MoreVertical,
  X, Check, AlertCircle, Trash2, Edit2, ChevronDown
} from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { DetalleVehiculo } from './DetalleVehiculo';

const ESTADOS_V = ["Sin Atender", "En Proceso", "Finalizada"];
const MARCAS = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Ducati", "BMW", "KTM", "Royal Enfield", "Harley-Davidson", "Otra"];
const initialFormV = { placa: "", marca: "Honda", modelo: "", año: new Date().getFullYear().toString(), cliente: "", telefono: "", estado: "Sin Atender" };

const statusStyle = (estado) => {
  if (estado === 'En Proceso') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  if (estado === 'Finalizada') return 'bg-green-500/10 text-green-400 border border-green-500/20';
  return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
};

const FILTER_TABS = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Sin Atender', value: 'Sin Atender' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Finalizadas', value: 'Finalizada' },
];

export const Vehiculos = () => {
  usePageTitle("Vehículos");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const [vehiculos, setVehiculos] = useState([
    { id: 1, placa: 'ABC123', marca: 'Honda', modelo: 'CBR 600RR', cliente: 'Carlos Martínez', telefono: '+57 310 456 7890', año: '2022', estado: 'En Proceso', ingreso: 'hace 10 días', servicios: 1 },
    { id: 2, placa: 'XYZ789', marca: 'Yamaha', modelo: 'MT-07', cliente: 'Laura Gómez', telefono: '+57 320 789 4561', año: '2021', estado: 'Sin Atender', ingreso: 'hace 8 días', servicios: 1 },
    { id: 3, placa: 'DEF456', marca: 'Kawasaki', modelo: 'Z900', cliente: 'Andrés Herrera', telefono: '+57 315 234 5678', año: '2023', estado: 'Finalizada', ingreso: 'hace 3 días', servicios: 2 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialFormV);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const vehiculosFiltrados = vehiculos.filter(v => {
    const t = busqueda.toLowerCase();
    const coincide = !t || v.placa.toLowerCase().includes(t) || v.cliente.toLowerCase().includes(t) || v.marca.toLowerCase().includes(t) || v.modelo.toLowerCase().includes(t);
    const estadoOk = filter === 'Todos' || v.estado === filter;
    return coincide && estadoOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.placa.trim()) e.placa = 'La placa es obligatoria.';
    if (!form.modelo.trim()) e.modelo = 'El modelo es obligatorio.';
    if (!form.cliente.trim()) e.cliente = 'El propietario es obligatorio.';
    return e;
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const v = vehiculos[index];
      setForm({ placa: v.placa, marca: v.marca, modelo: v.modelo, año: v.año, cliente: v.cliente, telefono: v.telefono || '', estado: v.estado });
      setEditIndex(index);
    } else {
      setForm(initialFormV);
      setEditIndex(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editIndex !== null) {
      setVehiculos(prev => prev.map((v, i) => i === editIndex
        ? { ...v, placa: form.placa.toUpperCase(), marca: form.marca, modelo: form.modelo, año: form.año, cliente: form.cliente, telefono: form.telefono, estado: form.estado }
        : v));
      showToast('Vehículo actualizado correctamente.');
    } else {
      setVehiculos(prev => [...prev, {
        id: Date.now(), placa: form.placa.toUpperCase(), marca: form.marca, modelo: form.modelo,
        año: form.año, cliente: form.cliente, telefono: form.telefono, estado: form.estado,
        ingreso: 'recién ingresado', servicios: 0
      }]);
      showToast('Vehículo registrado correctamente.');
    }
    closeModal();
  };

  const handleDelete = (index) => {
    setVehiculos(prev => prev.filter((_, i) => i !== index));
    setConfirmDeleteIndex(null);
    showToast('Vehículo eliminado.');
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (vehiculoSeleccionado) {
    return <DetalleVehiculo vehiculo={vehiculoSeleccionado} onBack={() => setVehiculoSeleccionado(null)} onUpdate={(updated) => { setVehiculos(prev => prev.map(v => v.id === updated.id ? updated : v)); setVehiculoSeleccionado(updated); }} />;
  }

  return (
    <div className="animate-in space-y-8 pb-10">

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">{editIndex !== null ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Placa *</label>
                  <input value={form.placa} onChange={handleChange('placa')} placeholder="Ej: ABC123"
                    className={`w-full bg-zinc-900 border ${errors.placa ? 'border-red-500/70' : 'border-zinc-800'} focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none uppercase transition-all`} />
                  {errors.placa && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.placa}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Año</label>
                  <input value={form.año} onChange={handleChange('año')} placeholder="2024"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Marca</label>
                  <div className="relative">
                    <select value={form.marca} onChange={handleChange('marca')}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                      {MARCAS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Modelo *</label>
                  <input value={form.modelo} onChange={handleChange('modelo')} placeholder="Ej: CBR 600RR"
                    className={`w-full bg-zinc-900 border ${errors.modelo ? 'border-red-500/70' : 'border-zinc-800'} focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.modelo && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.modelo}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Propietario *</label>
                <input value={form.cliente} onChange={handleChange('cliente')} placeholder="Nombre completo"
                  className={`w-full bg-zinc-900 border ${errors.cliente ? 'border-red-500/70' : 'border-zinc-800'} focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.cliente && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.cliente}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Teléfono</label>
                <input value={form.telefono} onChange={handleChange('telefono')} placeholder="+57 300 000 0000"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Estado</label>
                <div className="relative">
                  <select value={form.estado} onChange={handleChange('estado')}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                    {ESTADOS_V.map(e => <option key={e}>{e}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? 'Guardar Cambios' : 'Registrar Vehículo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar Vehículo</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Vehículos</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestión de motos en el taller</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Vehículo
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-2xl flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por placa, propietario..."
            className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
        </div>
        <div className="flex gap-1 shrink-0">
          {FILTER_TABS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === value ? 'bg-white text-zinc-900' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {vehiculosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Bike size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron vehículos</p>
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehiculosFiltrados.map((v) => {
          const realIndex = vehiculos.indexOf(v);
          return (
            <div
              key={v.id}
              onClick={() => setVehiculoSeleccionado(v)}
              className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98]"
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
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${statusStyle(v.estado)}`}>
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

              <div className="pt-6 border-t border-zinc-900 flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Clock size={16} />
                  <span>{v.ingreso}</span>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => openModal(realIndex)}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteIndex(realIndex)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                  <span className="text-blue-500 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-sm">
                    Ver detalle <MoreVertical size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};