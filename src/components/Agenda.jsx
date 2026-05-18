import React, { useState } from "react";
import {
  Plus, CalendarDays, CheckCircle2, Clock,
  ChevronRight, Calendar as CalendarIcon, X, Check,
  AlertCircle, Trash2, Wrench, ClipboardList, ArrowRight
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

// ── Tipos de cita ─────────────────────────────────────────────────────────
const TIPOS_CITA = ["Revisión Inicial", "Reparación / Servicio"];
const SERVICIOS_AGENDA = [
  "Cambio de Aceite", "Mantenimiento General", "Ajuste de Frenos",
  "Sincronización de Motor", "Revisión Eléctrica", "Cambio de Llantas",
  "Reparación de Escape", "Diagnóstico General"
];

// ── Genera los próximos 5 días hábiles desde hoy ──────────────────────────
function generarDiasHabiles(cantidad = 5) {
  const dias = [];
  const NOMBRES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  let d = new Date();
  let count = 0;
  while (count < cantidad) {
    const dow = d.getDay();
    if (dow !== 0) { // excluye domingos
      dias.push({
        id: d.toISOString().split("T")[0],
        nombre: NOMBRES[dow],
        fecha: `${d.getDate()} de ${MESES[d.getMonth()]}`,
        citas: [],
      });
      count++;
    }
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

const initialFormA = {
  cliente: "", vehiculo: "", tipo: "Revisión Inicial",
  servicio: "Cambio de Aceite", dia: "", hora: "", notas: "",
};

// Estado de una revisión completada → agenda 2da cita
const initialFormPost = {
  diagnostico: "", tiempoEstimado: "1 día",
  servicio: "Cambio de Aceite", dia: "", hora: "", notas: "",
};

const TIEMPOS_ESTIMADOS = ["1 hora", "2 horas", "Medio día", "1 día", "2 días", "3 días", "1 semana", "Más de 1 semana"];

export const Agenda = () => {
  usePageTitle("Agenda");

  const [dias, setDias] = useState(generarDiasHabiles(5));
  const [selectedDay, setSelectedDay] = useState(generarDiasHabiles(5)[0].id);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialFormA, dia: generarDiasHabiles(5)[0].id });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  // Modal post-revisión: agendar 2da cita
  const [showPostModal, setShowPostModal] = useState(false);
  const [postCitaRef, setPostCitaRef] = useState(null); // { dayId, citaIndex }
  const [formPost, setFormPost] = useState({ ...initialFormPost, dia: generarDiasHabiles(5)[0].id });
  const [errorsPost, setErrorsPost] = useState({});

  const citasDelDia = dias.find(d => d.id === selectedDay)?.citas || [];
  const totalCitas = dias.reduce((acc, d) => acc + d.citas.length, 0);
  const totalConfirmadas = dias.reduce((acc, d) => acc + d.citas.filter(c => c.confirmada).length, 0);
  const totalRevisiones = dias.reduce((acc, d) => acc + d.citas.filter(c => c.tipo === "Revisión Inicial").length, 0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ── Validaciones ─────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.cliente.trim()) e.cliente = "El nombre del cliente es obligatorio.";
    if (!form.vehiculo.trim()) e.vehiculo = "El vehículo es obligatorio.";
    if (!form.hora.trim()) e.hora = "La hora es obligatoria.";
    return e;
  };

  const validatePost = () => {
    const e = {};
    if (!formPost.diagnostico.trim()) e.diagnostico = "El diagnóstico es obligatorio.";
    if (!formPost.hora.trim()) e.hora = "La hora es obligatoria.";
    return e;
  };

  // ── Abrir/Cerrar modales ─────────────────────────────────────────────────
  const openModal = () => {
    setForm({ ...initialFormA, dia: selectedDay });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  // ── Crear cita ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const nuevaCita = {
      cliente: form.cliente,
      vehiculo: form.vehiculo,
      tipo: form.tipo,
      servicio: form.servicio,
      hora: form.hora,
      notas: form.notas,
      confirmada: false,
      estado: "Pendiente", // Pendiente | En Revisión | Diagnosticada | Segunda Cita Agendada | Completada
    };
    setDias(prev => prev.map(d => d.id === form.dia ? { ...d, citas: [...d.citas, nuevaCita] } : d));
    if (form.dia !== selectedDay) setSelectedDay(form.dia);
    showToast("Cita agendada correctamente.");
    closeModal();
  };

  // ── Eliminar cita ─────────────────────────────────────────────────────────
  const handleDelete = (citaIndex) => {
    setDias(prev => prev.map(d => d.id === selectedDay ? { ...d, citas: d.citas.filter((_, i) => i !== citaIndex) } : d));
    setConfirmDeleteIndex(null);
    showToast("Cita eliminada.");
  };

  // ── Confirmar / marcar estado ─────────────────────────────────────────────
  const toggleConfirmada = (citaIndex) => {
    setDias(prev => prev.map(d =>
      d.id === selectedDay
        ? { ...d, citas: d.citas.map((c, i) => i === citaIndex ? { ...c, confirmada: !c.confirmada } : c) }
        : d
    ));
  };

  // ── Avanzar estado de revisión ────────────────────────────────────────────
  const avanzarEstado = (citaIndex) => {
    setDias(prev => prev.map(d => {
      if (d.id !== selectedDay) return d;
      return {
        ...d,
        citas: d.citas.map((c, i) => {
          if (i !== citaIndex) return c;
          const mapaEstado = {
            "Pendiente": "En Revisión",
            "En Revisión": "Diagnosticada",
            "Diagnosticada": "Diagnosticada",
            "Segunda Cita Agendada": "Completada",
            "Completada": "Completada",
          };
          return { ...c, estado: mapaEstado[c.estado] || c.estado };
        }),
      };
    }));
  };

  // ── Modal 2da cita (post-revisión) ────────────────────────────────────────
  const openPostModal = (citaIndex) => {
    const cita = citasDelDia[citaIndex];
    setPostCitaRef({ dayId: selectedDay, citaIndex });
    setFormPost({ ...initialFormPost, dia: selectedDay, cliente: cita.cliente, vehiculo: cita.vehiculo });
    setErrorsPost({});
    setShowPostModal(true);
  };

  const closePostModal = () => { setShowPostModal(false); setErrorsPost({}); };

  const handleSubmitPost = () => {
    const e = validatePost();
    if (Object.keys(e).length > 0) { setErrorsPost(e); return; }
    const nuevaCita = {
      cliente: formPost.cliente,
      vehiculo: formPost.vehiculo,
      tipo: "Reparación / Servicio",
      servicio: formPost.servicio,
      hora: formPost.hora,
      notas: `Diagnóstico: ${formPost.diagnostico}. Tiempo estimado: ${formPost.tiempoEstimado}. ${formPost.notas}`.trim(),
      confirmada: false,
      estado: "Pendiente",
      esSeguimiento: true,
    };
    // Marcar cita original como "Segunda Cita Agendada"
    if (postCitaRef) {
      setDias(prev => prev.map(d => {
        if (d.id !== postCitaRef.dayId) return d;
        return {
          ...d,
          citas: d.citas.map((c, i) =>
            i === postCitaRef.citaIndex ? { ...c, estado: "Segunda Cita Agendada" } : c
          ),
        };
      }));
    }
    // Agregar nueva cita al día seleccionado
    setDias(prev => prev.map(d => d.id === formPost.dia ? { ...d, citas: [...d.citas, nuevaCita] } : d));
    if (formPost.dia !== selectedDay) setSelectedDay(formPost.dia);
    showToast("Cita de reparación agendada correctamente.");
    closePostModal();
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleChangePost = (field) => (e) => {
    setFormPost(prev => ({ ...prev, [field]: e.target.value }));
    if (errorsPost[field]) setErrorsPost(prev => ({ ...prev, [field]: undefined }));
  };

  // ── Estilos por estado ────────────────────────────────────────────────────
  const estadoStyle = (estado) => {
    const map = {
      "Pendiente":              "bg-zinc-800 text-zinc-400 border-zinc-700",
      "En Revisión":            "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Diagnosticada":          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      "Segunda Cita Agendada":  "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "Completada":             "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return map[estado] || "bg-zinc-800 text-zinc-400";
  };

  const tipoStyle = (tipo) =>
    tipo === "Revisión Inicial"
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      : "bg-orange-500/10 text-orange-400 border border-orange-500/20";

  return (
    <div className="animate-in space-y-8 pb-10">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* ── MODAL NUEVA CITA ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Nueva Cita</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              {/* Tipo de cita */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tipo de Cita</label>
                <div className="flex gap-3">
                  {TIPOS_CITA.map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(prev => ({ ...prev, tipo: t }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${form.tipo === t ? (t === "Revisión Inicial" ? "bg-blue-500/20 text-blue-400 border-blue-500/40" : "bg-orange-500/20 text-orange-400 border-orange-500/40") : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"}`}
                    >
                      {t === "Revisión Inicial" ? "🔍 Revisión Inicial" : "🔧 Reparación"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Cliente */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cliente *</label>
                <input value={form.cliente} onChange={handleChange("cliente")} placeholder="Nombre del cliente"
                  className={`w-full bg-zinc-900 border ${errors.cliente ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.cliente && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cliente}</p>}
              </div>
              {/* Vehículo */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Vehículo *</label>
                <input value={form.vehiculo} onChange={handleChange("vehiculo")} placeholder="Ej: Honda CB 600 - Roja"
                  className={`w-full bg-zinc-900 border ${errors.vehiculo ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.vehiculo && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.vehiculo}</p>}
              </div>
              {/* Servicio */}
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
              {/* Día y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Día</label>
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
              {/* Notas */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Notas</label>
                <textarea value={form.notas} onChange={handleChange("notas")} rows={2} placeholder="Observaciones adicionales..."
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

      {/* ── MODAL POST-REVISIÓN: AGENDAR 2DA CITA ───────────────────────── */}
      {showPostModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-white">Agendar Reparación</h3>
              <button onClick={closePostModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <p className="text-zinc-500 text-sm mb-6">
              Completa el diagnóstico y agenda la siguiente cita para <span className="text-white font-bold">{formPost.cliente}</span>.
            </p>
            <div className="space-y-4">
              {/* Diagnóstico */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Diagnóstico *</label>
                <textarea value={formPost.diagnostico} onChange={handleChangePost("diagnostico")} rows={3}
                  placeholder="Describe qué se encontró en la revisión y qué hay que hacer..."
                  className={`w-full bg-zinc-900 border ${errorsPost.diagnostico ? "border-red-500/70" : "border-zinc-800"} focus:border-orange-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none resize-none transition-all`} />
                {errorsPost.diagnostico && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errorsPost.diagnostico}</p>}
              </div>
              {/* Tiempo estimado */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Tiempo Estimado de Reparación</label>
                <div className="relative">
                  <select value={formPost.tiempoEstimado} onChange={handleChangePost("tiempoEstimado")}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                    {TIEMPOS_ESTIMADOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" />
                </div>
              </div>
              {/* Servicio a realizar */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Servicio a Realizar</label>
                <div className="relative">
                  <select value={formPost.servicio} onChange={handleChangePost("servicio")}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                    {SERVICIOS_AGENDA.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" />
                </div>
              </div>
              {/* Día y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Día</label>
                  <div className="relative">
                    <select value={formPost.dia} onChange={handleChangePost("dia")}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer capitalize">
                      {dias.map(d => <option key={d.id} value={d.id}>{d.nombre} {d.fecha}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Hora *</label>
                  <input type="time" value={formPost.hora} onChange={handleChangePost("hora")}
                    className={`w-full bg-zinc-900 border ${errorsPost.hora ? "border-red-500/70" : "border-zinc-800"} focus:border-orange-500/60 rounded-xl py-2.5 px-4 text-white outline-none transition-all`} />
                  {errorsPost.hora && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errorsPost.hora}</p>}
                </div>
              </div>
              {/* Notas adicionales */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Notas adicionales</label>
                <textarea value={formPost.notas} onChange={handleChangePost("notas")} rows={2} placeholder="Repuestos necesarios, observaciones..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closePostModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmitPost} className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-bold text-sm transition-all">
                Agendar Reparación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Cancelar Cita</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acción eliminará la cita permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Volver</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Cancelar Cita</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
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

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Citas",     value: totalCitas,                        icon: CalendarDays,  color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Confirmadas",     value: totalConfirmadas,                  icon: CheckCircle2,  color: "text-green-500",  bg: "bg-green-500/10" },
          { label: "Pendientes",      value: totalCitas - totalConfirmadas,     icon: Clock,         color: "text-blue-500",   bg: "bg-blue-500/10" },
          { label: "Revisiones",      value: totalRevisiones,                   icon: ClipboardList, color: "text-cyan-500",   bg: "bg-cyan-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={22} /></div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CALENDARIO + CITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LISTA DE DÍAS */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-4 space-y-2">
            <div className="flex items-center gap-2 px-4 py-2 text-zinc-400 mb-2">
              <CalendarIcon size={18} />
              <span className="font-bold text-xs uppercase tracking-widest">Próximos días</span>
            </div>
            {dias.map((dia) => (
              <button key={dia.id} onClick={() => setSelectedDay(dia.id)}
                className={`w-full flex flex-col items-start px-5 py-4 rounded-2xl transition-all ${selectedDay === dia.id ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 scale-[1.02]" : "bg-transparent text-zinc-500 hover:bg-zinc-900"}`}>
                <span className={`text-[10px] font-black uppercase tracking-tighter capitalize ${selectedDay === dia.id ? "text-purple-200" : "text-zinc-600"}`}>{dia.nombre}</span>
                <span className="text-base font-bold">{dia.fecha}</span>
                {dia.citas.length > 0 && (
                  <span className={`text-xs mt-1 font-semibold ${selectedDay === dia.id ? "text-purple-200" : "text-zinc-500"}`}>
                    {dia.citas.length} cita{dia.citas.length !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DE CITAS DEL DÍA */}
        <div className="lg:col-span-9">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 capitalize">
              Citas para {dias.find(d => d.id === selectedDay)?.nombre}, {dias.find(d => d.id === selectedDay)?.fecha}
            </h3>

            {citasDelDia.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-zinc-800">
                  <CalendarIcon size={40} className="text-zinc-700" />
                </div>
                <div>
                  <p className="text-zinc-500 font-bold text-lg">No hay citas programadas</p>
                  <p className="text-zinc-600 text-sm mt-1">Las nuevas citas que agendes aparecerán aquí.</p>
                </div>
                <button onClick={openModal} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95">
                  <Plus size={18} />Programar Cita
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {citasDelDia.map((cita, i) => (
                  <div key={i} className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${cita.confirmada ? "bg-green-500/5 border-green-500/20" : "bg-zinc-900/60 border-zinc-800"}`}>
                    <div className="flex items-start gap-4">
                      {/* Check confirmar */}
                      <button onClick={() => toggleConfirmada(i)} className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all border ${cita.confirmada ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white"}`}>
                        <CheckCircle2 size={20} />
                      </button>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-white font-bold">{cita.cliente}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tipoStyle(cita.tipo)}`}>{cita.tipo}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${estadoStyle(cita.estado)}`}>{cita.estado}</span>
                          {cita.confirmada && <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-md font-semibold">Confirmada</span>}
                          {cita.esSeguimiento && <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold">Seguimiento</span>}
                        </div>
                        <p className="text-zinc-400 text-sm truncate">{cita.vehiculo} — {cita.servicio}</p>
                        {cita.notas && <p className="text-zinc-600 text-xs mt-1 line-clamp-2">{cita.notas}</p>}
                      </div>
                      {/* Hora + eliminar */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-purple-400 font-bold text-sm"><Clock size={14}/>{cita.hora}</div>
                        <button onClick={() => setConfirmDeleteIndex(i)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Acciones de flujo */}
                    <div className="flex flex-wrap gap-2 pl-14">
                      {/* Avanzar estado */}
                      {cita.estado !== "Completada" && cita.estado !== "Segunda Cita Agendada" && (
                        <button
                          onClick={() => avanzarEstado(i)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition-colors"
                        >
                          <ArrowRight size={12} />
                          {cita.estado === "Pendiente" ? "Iniciar Revisión" : cita.estado === "En Revisión" ? "Marcar Diagnosticada" : "Avanzar"}
                        </button>
                      )}
                      {/* Agendar 2da cita */}
                      {cita.tipo === "Revisión Inicial" && cita.estado === "Diagnosticada" && (
                        <button
                          onClick={() => openPostModal(i)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg border border-orange-500/30 transition-colors"
                        >
                          <Wrench size={12} />
                          Agendar Reparación
                        </button>
                      )}
                      {/* Completar */}
                      {cita.estado === "Segunda Cita Agendada" && (
                        <button
                          onClick={() => avanzarEstado(i)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-500/30 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          Marcar Completada
                        </button>
                      )}
                    </div>
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
