import React, { useState } from "react";
import {
  FileText, ExternalLink, Plus, Search, Check,
  AlertCircle, Trash2, Calendar, User, DollarSign, Info, X
} from "lucide-react";
import empresa from "../config/empresa";
import { usePageTitle } from "../hooks/usePageTitle";

const ESTADOS_REF = ["Registrada", "Enviada", "Pagada", "Cancelada"];
const initialForm = { numero: "", cliente: "", fecha: "", servicio: "", monto: "", estado: "Registrada", notas: "" };

export const Facturas = () => {
  usePageTitle("Facturas");

  const sf = empresa.sistemaFacturacion;

  const [referencias, setReferencias] = useState([
    { numero: "FAC-001", cliente: "Carlos Ramirez",  fecha: "10 may 2026", servicio: "Cambio de Aceite", monto: "$250.000", estado: "Pagada",     notas: "" },
    { numero: "FAC-002", cliente: "Laura Gomez",     fecha: "12 may 2026", servicio: "Ajuste de Frenos",  monto: "$180.000", estado: "Enviada",    notas: "" },
    { numero: "FAC-003", cliente: "Andres Torres",   fecha: "15 may 2026", servicio: "Mantenimiento Gral.", monto: "$320.000", estado: "Pagada",   notas: "" },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const refsFiltradas = referencias.filter(r => {
    const t = busqueda.toLowerCase();
    const coincide = r.numero.toLowerCase().includes(t) || r.cliente.toLowerCase().includes(t) || r.servicio.toLowerCase().includes(t);
    const estadoOk = filtroEstado === "Todos" || r.estado === filtroEstado;
    return coincide && estadoOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.numero.trim()) e.numero = "El nÃºmero es obligatorio.";
    if (!form.cliente.trim()) e.cliente = "El cliente es obligatorio.";
    if (!form.fecha.trim()) e.fecha = "La fecha es obligatoria.";
    if (!form.monto.trim()) e.monto = "El monto es obligatorio.";
    return e;
  };

  const openModal = () => {
    setForm(initialForm);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setReferencias(prev => [...prev, { ...form }]);
    showToast("Referencia de factura registrada.");
    closeModal();
  };

  const handleDelete = (index) => {
    setReferencias(prev => prev.filter((_, i) => i !== index));
    setConfirmDeleteIndex(null);
    showToast("Referencia eliminada.");
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const estadoClass = (estado) => {
    const map = {
      "Registrada": "bg-zinc-800 text-zinc-400 border-zinc-700",
      "Enviada":    "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Pagada":     "bg-green-500/10 text-green-400 border-green-500/20",
      "Cancelada":  "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[estado] || "bg-zinc-800 text-zinc-400";
  };

  const totalPagadas = referencias.filter(r => r.estado === "Pagada").length;
  const totalPendientes = referencias.filter(r => r.estado !== "Pagada" && r.estado !== "Cancelada").length;

  return (
    <div className="animate-in space-y-8 pb-10">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* MODAL NUEVA REFERENCIA */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Registrar Referencia</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <p className="text-zinc-500 text-sm mb-6">
              Registra la referencia de una factura emitida en el sistema externo para cruzarla con los servicios del taller.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">NÂ° Factura *</label>
                  <input value={form.numero} onChange={handleChange("numero")} placeholder="Ej: FAC-004"
                    className={`w-full bg-zinc-900 border ${errors.numero ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.numero && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.numero}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Fecha *</label>
                  <input type="date" value={form.fecha} onChange={handleChange("fecha")}
                    className={`w-full bg-zinc-900 border ${errors.fecha ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white outline-none transition-all`} />
                  {errors.fecha && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fecha}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cliente *</label>
                <input value={form.cliente} onChange={handleChange("cliente")} placeholder="Nombre del cliente"
                  className={`w-full bg-zinc-900 border ${errors.cliente ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.cliente && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.cliente}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Servicio</label>
                <input value={form.servicio} onChange={handleChange("servicio")} placeholder="Servicio realizado"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Monto *</label>
                  <input value={form.monto} onChange={handleChange("monto")} placeholder="Ej: $250.000"
                    className={`w-full bg-zinc-900 border ${errors.monto ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.monto && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.monto}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Estado</label>
                  <select value={form.estado} onChange={handleChange("estado")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white outline-none cursor-pointer">
                    {ESTADOS_REF.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Notas</label>
                <textarea value={form.notas} onChange={handleChange("notas")} rows={2} placeholder="Observaciones..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">Registrar</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAR ELIMINAR */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar Referencia</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acciÃ³n no se puede deshacer.</p>
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
          <h2 className="text-4xl font-black text-white tracking-tight">FacturaciÃ³n</h2>
          <p className="text-zinc-500 mt-1 font-medium">GestiÃ³n externa de facturas y registro de referencias</p>
        </div>
        <button onClick={openModal} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Registrar Referencia
        </button>
      </div>

      {/* PANEL INFORMATIVO â€” SISTEMA EXTERNO */}
      <div className="bg-zinc-950 border border-cyan-500/20 rounded-[2rem] p-7">
        <div className="flex items-start gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-2xl flex-shrink-0">
            <Info size={24} className="text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-white mb-1">FacturaciÃ³n gestionada externamente</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              {sf.instrucciones}
            </p>
            {sf.url ? (
              <a
                href={sf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all"
              >
                <ExternalLink size={16} />
                Ir a {sf.nombre}
              </a>
            ) : (
              <p className="text-zinc-600 text-sm italic">
                Configura la URL del sistema externo en <code className="text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">src/config/empresa.js</code>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Referencias", value: referencias.length,  icon: FileText,    color: "text-zinc-400",  bg: "bg-zinc-800" },
          { label: "Pagadas",           value: totalPagadas,         icon: Check,       color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Pendientes",        value: totalPendientes,      icon: Calendar,    color: "text-yellow-400",bg: "bg-yellow-500/10" },
          { label: "Canceladas",        value: referencias.filter(r => r.estado === "Cancelada").length, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} flex-shrink-0`}><stat.icon size={20} /></div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTRO DE REFERENCIAS */}
      <div>
        <h3 className="text-lg font-black text-white mb-4">Registro de Referencias</h3>

        {/* BÃšSQUEDA Y FILTRO */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nÃºmero, cliente o servicio..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all" />
          </div>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none cursor-pointer">
            <option>Todos</option>
            {ESTADOS_REF.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>

        {/* TABLA */}
        {refsFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <FileText size={40} className="mb-4 text-zinc-700" />
            <p className="font-bold text-lg">No se encontraron referencias</p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
              <div className="col-span-2">NÂ° Factura</div>
              <div className="col-span-3">Cliente</div>
              <div className="col-span-3">Servicio</div>
              <div className="col-span-1">Fecha</div>
              <div className="col-span-1">Monto</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1"></div>
            </div>
            {refsFiltradas.map((ref, i) => {
              const realIndex = referencias.indexOf(ref);
              return (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors items-center last:border-none">
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-purple-400" />
                    </div>
                    <span className="text-white font-bold text-sm font-mono">{ref.numero}</span>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2 text-zinc-300 text-sm">
                    <User size={14} className="text-zinc-500 flex-shrink-0" />{ref.cliente}
                  </div>
                  <div className="md:col-span-3 text-zinc-400 text-sm truncate">{ref.servicio || "—"}</div>
                  <div className="md:col-span-1 flex items-center gap-1 text-zinc-500 text-xs whitespace-nowrap">
                    <Calendar size={12}/>{ref.fecha}
                  </div>
                  <div className="md:col-span-1 text-white font-bold text-sm">{ref.monto}</div>
                  <div className="md:col-span-1">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${estadoClass(ref.estado)}`}>{ref.estado}</span>
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    <button onClick={() => setConfirmDeleteIndex(realIndex)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
