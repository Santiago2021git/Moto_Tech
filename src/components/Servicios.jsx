import React, { useState } from "react";
import { 
  Plus, Search, ChevronDown, Wrench, Clock, 
  Tag, Activity, List, Edit2, Trash2, X, Check, AlertCircle
} from "lucide-react";
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';

const CATS_SERVICIO = ["Mantenimiento", "Frenos", "Motor", "Transmisión", "Eléctrico", "Suspensión", "Carrocería", "Otros"];
const COLORES_S = ["from-blue-600 to-indigo-600","from-purple-600 to-pink-600","from-emerald-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600"];
const initialFormS = { titulo: "", categoria: "Mantenimiento", descripcion: "", duracion: "", precio: "", incluye: "" };

export const Servicios = () => {
  usePageTitle("Servicios");
  const { servicios: catalogo, agregarServicio, actualizarServicio, eliminarServicio } = useApp();
  const { tallerActivo } = useAuth();
  const servicios = catalogo.filter(s => !s.tallerId || s.tallerId === tallerActivo?.id);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas las categorías");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialFormS);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const serviciosFiltrados = servicios.filter(s => {
    const t = busqueda.toLowerCase();
    const coincide = s.titulo.toLowerCase().includes(t) || s.descripcion.toLowerCase().includes(t);
    const catOk = filtroCategoria === "Todas las categorías" || s.categoria === filtroCategoria;
    return coincide && catOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio.";
    if (!form.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
    if (!form.duracion.trim()) e.duracion = "La duración es obligatoria.";
    if (!form.precio.trim()) e.precio = "El precio es obligatorio.";
    return e;
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const s = servicios[index];
      setForm({ titulo: s.titulo, categoria: s.categoria, descripcion: s.descripcion, duracion: s.duracion, precio: s.precio, incluye: (s.incluye || []).join(", ") });
      setEditIndex(index);
    } else {
      setForm(initialFormS);
      setEditIndex(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const incluyeArr = form.incluye.split(",").map(i => i.trim()).filter(Boolean);
    if (editIndex !== null) {
      const s = servicios[editIndex];
      actualizarServicio(s.id, { titulo: form.titulo, categoria: form.categoria, descripcion: form.descripcion, duracion: form.duracion, precio: form.precio, incluye: incluyeArr });
      showToast("Servicio actualizado correctamente.");
    } else {
      agregarServicio({
        tallerId: tallerActivo?.id,
        titulo: form.titulo, categoria: form.categoria, descripcion: form.descripcion,
        duracion: form.duracion, precio: form.precio, incluye: incluyeArr,
        popularidad: 0, color: COLORES_S[servicios.length % COLORES_S.length],
      });
      showToast("Servicio creado correctamente.");
    }
    closeModal();
  };

  const handleDelete = (index) => {
    const s = servicios[index];
    if (s) eliminarServicio(s.id);
    setConfirmDeleteIndex(null);
    showToast("Servicio eliminado.");
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
              <h3 className="text-xl font-black text-white">{editIndex !== null ? "Editar Servicio" : "Nuevo Servicio"}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Título *</label>
                <input value={form.titulo} onChange={handleChange("titulo")} placeholder="Ej: Cambio de aceite completo"
                  className={`w-full bg-zinc-900 border ${errors.titulo ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.titulo && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.titulo}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Categoría</label>
                <div className="relative">
                  <select value={form.categoria} onChange={handleChange("categoria")}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                    {CATS_SERVICIO.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Descripción *</label>
                <textarea value={form.descripcion} onChange={handleChange("descripcion")} rows={3} placeholder="Describe el servicio..."
                  className={`w-full bg-zinc-900 border ${errors.descripcion ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none resize-none transition-all`} />
                {errors.descripcion && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.descripcion}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Duración *</label>
                  <input value={form.duracion} onChange={handleChange("duracion")} placeholder="Ej: 45 min"
                    className={`w-full bg-zinc-900 border ${errors.duracion ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.duracion && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.duracion}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Precio *</label>
                  <input value={form.precio} onChange={handleChange("precio")} placeholder="Ej: $50.000"
                    className={`w-full bg-zinc-900 border ${errors.precio ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                  {errors.precio && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.precio}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Incluye (separado por comas)</label>
                <input value={form.incluye} onChange={handleChange("incluye")} placeholder="Ej: Aceite, Filtro de aceite"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? "Guardar Cambios" : "Crear Servicio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Trash2 size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar Servicio</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acción no se puede deshacer. El servicio será eliminado permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Servicios del Taller</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestiona los servicios ofrecidos, costos y tiempos estimados</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Servicio
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><List size={16} /><p className="text-sm font-medium">Total Servicios</p></div>
          <p className="text-3xl font-black text-white">{servicios.length}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Tag size={16} /><p className="text-sm font-medium">Precio Promedio</p></div>
          <p className="text-3xl font-black text-white">$93.125</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Clock size={16} /><p className="text-sm font-medium">Tiempo Promedio</p></div>
          <p className="text-3xl font-black text-white">77 min</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Activity size={16} /><p className="text-sm font-medium">Categorías</p></div>
          <p className="text-3xl font-black text-white">{new Set(servicios.map(s => s.categoria)).size}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar servicios..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todas las categorías</option>
            {CATS_SERVICIO.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {serviciosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron servicios</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda o filtro.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {serviciosFiltrados.map((servicio, i) => {
          const realIndex = servicios.indexOf(servicio);
          return (
            <div key={i} className="bg-zinc-950 border border-zinc-800 hover:border-purple-500/30 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col group relative overflow-hidden">
              <div className="flex gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${servicio.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-1">{servicio.titulo}</h3>
                  <span className="inline-block bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-medium border border-zinc-800">{servicio.categoria}</span>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed line-clamp-2">{servicio.descripcion}</p>
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock size={18} className="text-zinc-500" />
                  <span className="font-medium">{servicio.duracion}</span>
                </div>
                <div className="text-xl font-black text-white">{servicio.precio}</div>
              </div>
              <div className="mb-6 flex-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Incluye:</p>
                <div className="flex flex-wrap gap-2">
                  {servicio.incluye.map((item, index) => (
                    <span key={index} className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-purple-500/20">{item}</span>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Popularidad</p>
                  <span className="text-xs font-bold text-zinc-400">{servicio.popularidad}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${servicio.popularidad}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 mt-auto">
                <button onClick={() => openModal(realIndex)} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">
                  <Edit2 size={16} />Editar
                </button>
                <button onClick={() => setConfirmDeleteIndex(realIndex)} className="flex items-center justify-center w-11 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
