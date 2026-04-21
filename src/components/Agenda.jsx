import React, { useState } from "react";
import {
  Plus, CalendarDays, CheckCircle2, Clock,
  ChevronRight, Calendar as CalendarIcon, X, Check, AlertCircle, Trash2
} from "lucide-react";

const SERVICIOS_AGENDA = ["Cambio de Aceite", "Mantenimiento General", "Ajuste de Frenos", "Sincronizacion de Motor", "Revision Electrica", "Cambio de Llantas"];
const initialFormA = { cliente: "", vehiculo: "", servicio: "Cambio de Aceite", dia: "lunes", hora: "", notas: "" };

export const Agenda = () => {
  const [dias, setDias] = useState([
    { id: "lunes", nombre: "lunes", fecha: "2 de marzo", citas: [] },
    { id: "martes", nombre: "martes", fecha: "3 de marzo", citas: [] },
    { id: "miercoles", nombre: "miercoles", fecha: "4 de marzo", citas: [] },
  ]);

  const [selectedDay, setSelectedDay] = useState("lunes");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialFormA);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const citasDelDia = dias.find(d => d.id === selectedDay)?.citas || [];
  const totalCitas = dias.reduce((acc, d) => acc + d.citas.length, 0);
  const totalConfirmadas = dias.reduce((acc, d) => acc + d.citas.filter(c => c.confirmada).length, 0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.cliente.trim()) e.cliente = "El nombre del cliente es obligatorio.";
    if (!form.vehiculo.trim()) e.vehiculo = "El vehiculo es obligatorio.";
    if (!form.hora.trim()) e.hora = "La hora es obligatoria.";
    return e;
  };

  const openModal = () => {
    setForm({ ...initialFormA, dia: selectedDay });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const nuevaCita = { cliente: form.cliente, vehiculo: form.vehiculo, servicio: form.servicio, hora: form.hora, notas: form.notas, confirmada: false };
    setDias(prev => prev.map(d => d.id === form.dia ? { ...d, citas: [...d.citas, nuevaCita] } : d));
    if (form.dia !== selectedDay) setSelectedDay(form.dia);
    showToast("Cita agendada correctamente.");
    closeModal();
  };

  const handleDelete = (citaIndex) => {
    setDias(prev => prev.map(d => d.id === selectedDay ? { ...d, citas: d.citas.filter((_, i) => i !== citaIndex) } : d));
    setConfirmDeleteIndex(null);
    showToast("Cita eliminada.");
  };

  const toggleConfirmada = (citaIndex) => {
    setDias(prev => prev.map(d => d.id === selectedDay ? { ...d, citas: d.citas.map((c, i) => i === citaIndex ? { ...c, confirmada: !c.confirmada } : c) } : d));
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="animate-in space-y-8 pb-10">

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Nueva Cita</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cliente *</label>
                <input value={form.cliente} onChange={handleChange("cliente")} placeholder="Nombre del cliente"
                  className={`w-full bg-zinc-900 border ${errors.cliente ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.cliente && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cliente}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Vehiculo *</label>
                <input value={form.vehiculo} onChange={handleChange("vehiculo")} placeholder="Ej: Honda CB 600 - Roja"
                  className={`w-full bg-zinc-900 border ${errors.vehiculo ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.vehiculo && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.vehiculo}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Servicio</label>
                <div className="relative">
                  <select value={form.servicio} onChange={handleChange("servicio")}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                    {SERVICIOS_AGENDA.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Dia</label>
                  <div className="relative">
                    <select value={form.dia} onChange={handleChange("dia")}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer capitalize">
                      {dias.map(d => <option key={d.id} value={d.id}>{d.nombre} {d.fecha}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Hora *</label>
                  <input type="time" value={form.hora} onChange={handleChange("hora")}
                    className={`w-full bg-zinc-900 border ${errors.hora ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white outline-none transition-all`} />
                  {errors.hora && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.hora}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Notas</label>
                <textarea value={form.notas} onChange={handleChange("notas")} rows={3} placeholder="Observaciones adicionales..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">Agendar Cita</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Cancelar Cita</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta accion eliminara la cita permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Volver</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Cancelar Cita</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Agenda de Citas</h2>
          <p className="text-zinc-500 mt-1 font-medium">Programa y gestiona las citas del taller</p>
        </div>
        <button onClick={openModal} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Citas", value: totalCitas, icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Confirmadas", value: totalConfirmadas, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Pendientes", value: totalCitas - totalConfirmadas, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-4 space-y-2">
            <div className="flex items-center gap-2 px-4 py-2 text-zinc-400 mb-2">
              <CalendarIcon size={18} />
              <span className="font-bold text-xs uppercase tracking-widest">Semana</span>
            </div>
            {dias.map((dia) => (
              <button key={dia.id} onClick={() => setSelectedDay(dia.id)}
                className={`w-full flex flex-col items-start px-5 py-4 rounded-2xl transition-all ${selectedDay === dia.id ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 scale-[1.02]" : "bg-transparent text-zinc-500 hover:bg-zinc-900"}`}>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedDay === dia.id ? "text-purple-200" : "text-zinc-600"}`}>{dia.nombre}</span>
                <span className="text-base font-bold">{dia.fecha}</span>
                {dia.citas.length > 0 && (
                  <span className={`text-xs mt-1 font-semibold ${selectedDay === dia.id ? "text-purple-200" : "text-zinc-500"}`}>{dia.citas.length} cita{dia.citas.length !== 1 ? "s" : ""}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 capitalize">
              Citas para {dias.find(d => d.id === selectedDay)?.nombre}, {dias.find(d => d.id === selectedDay)?.fecha}
            </h3>
            {citasDelDia.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-zinc-800 shadow-inner">
                  <CalendarIcon size={40} className="text-zinc-700" />
                </div>
                <div>
                  <p className="text-zinc-500 font-bold text-lg">No hay citas programadas para este dia</p>
                  <p className="text-zinc-600 text-sm mt-1">Las nuevas citas que agendes apareceran en este listado.</p>
                </div>
                <button onClick={openModal} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95">
                  <Plus size={18} />
                  Programar Cita
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {citasDelDia.map((cita, i) => (
                  <div key={i} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${cita.confirmada ? "bg-green-500/5 border-green-500/20" : "bg-zinc-900/60 border-zinc-800"}`}>
                    <button onClick={() => toggleConfirmada(i)} className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border ${cita.confirmada ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white"}`}>
                      <CheckCircle2 size={20} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold">{cita.cliente}</span>
                        {cita.confirmada && <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md font-semibold">Confirmada</span>}
                      </div>
                      <p className="text-zinc-400 text-sm">{cita.vehiculo} â€” {cita.servicio}</p>
                      {cita.notas && <p className="text-zinc-600 text-xs mt-1">{cita.notas}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-purple-400 font-bold"><Clock size={14}/>{cita.hora}</div>
                    </div>
                    <button onClick={() => setConfirmDeleteIndex(i)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
