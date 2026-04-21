import React, { useState } from "react";
import { 
  Plus, Search, FileText, DollarSign, Calendar, User, 
  ChevronDown, X, Check, AlertCircle, Eye, Trash2
} from "lucide-react";

const ESTADOS_FACTURA = ["Pagada", "Pendiente", "Cancelada"];
const initialFormF = { numero: "", cliente: "", fecha: "", servicio: "", total: "", estado: "Pendiente" };

export const Facturas = () => {
  const [facturas, setFacturas] = useState([
    { numero: "FAC-001", cliente: "Carlos Ramirez", fecha: "10 Mar 2026", servicio: "Cambio de Aceite Completo", total: "$250.000", estado: "Pagada" },
    { numero: "FAC-002", cliente: "Laura Gomez", fecha: "12 Mar 2026", servicio: "Ajuste de Frenos", total: "$180.000", estado: "Pendiente" },
    { numero: "FAC-003", cliente: "Andres Torres", fecha: "15 Mar 2026", servicio: "Mantenimiento General", total: "$320.000", estado: "Pagada" },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialFormF);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const facturasFiltradas = facturas.filter(f => {
    const t = busqueda.toLowerCase();
    const coincide = f.numero.toLowerCase().includes(t) || f.cliente.toLowerCase().includes(t) || f.servicio.toLowerCase().includes(t);
    const estadoOk = filtroEstado === "Todos" || f.estado === filtroEstado;
    return coincide && estadoOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.numero.trim()) e.numero = "El numero de factura es obligatorio.";
    if (!form.cliente.trim()) e.cliente = "El cliente es obligatorio.";
    if (!form.fecha.trim()) e.fecha = "La fecha es obligatoria.";
    if (!form.total.trim()) e.total = "El total es obligatorio.";
    return e;
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setForm({ ...facturas[index] });
      setEditIndex(index);
    } else {
      setForm(initialFormF);
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
      setFacturas(prev => prev.map((f, i) => i === editIndex ? { ...form } : f));
      showToast("Factura actualizada correctamente.");
    } else {
      setFacturas(prev => [...prev, { ...form }]);
      showToast("Factura creada correctamente.");
    }
    closeModal();
  };

  const handleDelete = (index) => {
    setFacturas(prev => prev.filter((_, i) => i !== index));
    setConfirmDeleteIndex(null);
    showToast("Factura eliminada.");
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const estadoClass = (estado) =>
    estado === "Pagada" ? "bg-green-500/10 text-green-400 border border-green-500/20"
    : estado === "Pendiente" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
    : "bg-red-500/10 text-red-400 border border-red-500/20";

  const totalPagado = facturas.filter(f => f.estado === "Pagada").length;
  const totalPendiente = facturas.filter(f => f.estado === "Pendiente").length;

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
              <h3 className="text-xl font-black text-white">{editIndex !== null ? "Editar Factura" : "Nueva Factura"}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Numero *</label>
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
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Total *</label>
                  <input value={form.total} onChange={handleChange("total")} placeholder="Ej: $250.000"
                    className={`w-full bg-zinc-900 border ${errors.total ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.total && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.total}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Estado</label>
                  <div className="relative">
                    <select value={form.estado} onChange={handleChange("estado")}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                      {ESTADOS_FACTURA.map(e => <option key={e}>{e}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? "Guardar Cambios" : "Crear Factura"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Detalle de Factura</h3>
              <button onClick={() => setDetalle(null)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-500 text-sm">Numero</span>
                <span className="text-white font-bold">{detalle.numero}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-500 text-sm">Cliente</span>
                <span className="text-white font-semibold">{detalle.cliente}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-500 text-sm">Servicio</span>
                <span className="text-white font-semibold text-right max-w-[200px]">{detalle.servicio || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-500 text-sm">Fecha</span>
                <span className="text-white font-semibold">{detalle.fecha}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <span className="text-zinc-500 text-sm">Total</span>
                <span className="text-2xl font-black text-white">{detalle.total}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-zinc-500 text-sm">Estado</span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${estadoClass(detalle.estado)}`}>{detalle.estado}</span>
              </div>
            </div>
            <button onClick={() => setDetalle(null)} className="w-full mt-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar Factura</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta accion no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Facturas</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestion y control de facturacion del taller</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nueva Factura
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><FileText size={16}/><p className="text-sm font-medium">Total Facturas</p></div>
          <p className="text-3xl font-black text-white">{facturas.length}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Check size={16}/><p className="text-sm font-medium">Pagadas</p></div>
          <p className="text-3xl font-black text-green-400">{totalPagado}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Calendar size={16}/><p className="text-sm font-medium">Pendientes</p></div>
          <p className="text-3xl font-black text-yellow-400">{totalPendiente}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><DollarSign size={16}/><p className="text-sm font-medium">Este mes</p></div>
          <p className="text-3xl font-black text-white">{facturas.length}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por numero, cliente o servicio..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative">
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none cursor-pointer shadow-sm">
            <option>Todos</option>
            {ESTADOS_FACTURA.map(e => <option key={e}>{e}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {facturasFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron facturas</p>
          <p className="text-sm mt-1">Intenta con otro termino de busqueda o filtro.</p>
        </div>
      )}

      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
          <div className="col-span-2">Numero</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-3">Servicio</div>
          <div className="col-span-1">Fecha</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-1">Estado</div>
          <div className="col-span-1"></div>
        </div>
        {facturasFiltradas.map((factura, i) => {
          const realIndex = facturas.indexOf(factura);
          return (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/60 hover:bg-zinc-900/40 transition-colors items-center last:border-none">
              <div className="md:col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-purple-400" />
                </div>
                <span className="text-white font-bold text-sm">{factura.numero}</span>
              </div>
              <div className="md:col-span-3 flex items-center gap-2 text-zinc-300 text-sm">
                <User size={14} className="text-zinc-500 shrink-0" />{factura.cliente}
              </div>
              <div className="md:col-span-3 text-zinc-400 text-sm truncate">{factura.servicio || "—"}</div>
              <div className="md:col-span-1 flex items-center gap-1 text-zinc-500 text-xs">
                <Calendar size={12}/>{factura.fecha}
              </div>
              <div className="md:col-span-1 text-white font-bold text-sm">{factura.total}</div>
              <div className="md:col-span-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${estadoClass(factura.estado)}`}>{factura.estado}</span>
              </div>
              <div className="md:col-span-1 flex items-center justify-end gap-2">
                <button onClick={() => setDetalle(factura)} className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors" title="Ver detalle">
                  <Eye size={15} />
                </button>
                <button onClick={() => openModal(realIndex)} className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors" title="Editar">
                  <FileText size={15} />
                </button>
                <button onClick={() => setConfirmDeleteIndex(realIndex)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors" title="Eliminar">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
