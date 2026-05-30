import React, { useState } from "react";
import { 
  Package, Plus, Search, AlertCircle, 
  Edit3, ChevronDown, MapPin, Tag, 
  TrendingDown, Layers, ShoppingCart, X, Check,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";

const ITEMS_PER_PAGE = 20;

const COLORES = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const CATEGORIAS = ["Lubricantes", "Filtros", "Transmisión", "Eléctrico", "Frenos", "Llantas", "Carrocería", "Otros"];

const initialForm = { nombre: "", marca: "", codigo: "", categoria: "Lubricantes", stock: "", minStock: "", precio: "", ubicacion: "" };

export const Inventario = () => {
  usePageTitle("Inventario");
  const { inventario, agregarItem, actualizarItem } = useApp();
  const { tallerActivo } = useAuth();
  const items = inventario.filter(i => !i.tallerId || i.tallerId === tallerActivo?.id);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas las categorías");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [reabastecerIndex, setReabastecerIndex] = useState(null);
  const [cantidadReabastecer, setCantidadReabastecer] = useState("");
  const [errorReabastecer, setErrorReabastecer] = useState("");

  const stockBajoItems = items.filter(item => item.stock < item.minStock);

  const itemsFiltrados = items.filter(item => {
    const t = busqueda.toLowerCase();
    const coincide = item.nombre.toLowerCase().includes(t) || item.codigo.toLowerCase().includes(t) || item.marca.toLowerCase().includes(t);
    const catOk = filtroCategoria === "Todas las categorías" || item.categoria === filtroCategoria;
    return coincide && catOk;
  });

  // Reset page when filters change
  React.useEffect(() => { setCurrentPage(1); }, [busqueda, filtroCategoria]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.marca.trim()) e.marca = "La marca es obligatoria.";
    if (!form.codigo.trim()) e.codigo = "El código es obligatorio.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Ingresa un stock válido (≥ 0).";
    if (!form.minStock || isNaN(Number(form.minStock)) || Number(form.minStock) < 0) e.minStock = "Ingresa un mínimo válido (≥ 0).";
    if (!form.precio.trim()) e.precio = "El precio es obligatorio.";
    if (!form.ubicacion.trim()) e.ubicacion = "La ubicación es obligatoria.";
    return e;
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const it = items[index];
      setForm({ nombre: it.nombre, marca: it.marca, codigo: it.codigo, categoria: it.categoria, stock: String(it.stock), minStock: String(it.minStock), precio: it.precio, ubicacion: it.ubicacion });
      setEditIndex(index);
    } else {
      setForm(initialForm);
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
      const it = items[editIndex];
      actualizarItem(it.id, { nombre: form.nombre, marca: form.marca, codigo: form.codigo, categoria: form.categoria, stock: Number(form.stock), minStock: Number(form.minStock), precio: form.precio, ubicacion: form.ubicacion });
      showToast("Repuesto actualizado correctamente.");
    } else {
      agregarItem({
        tallerId: tallerActivo?.id,
        nombre: form.nombre, marca: form.marca, codigo: form.codigo, categoria: form.categoria,
        stock: Number(form.stock), minStock: Number(form.minStock), precio: form.precio, ubicacion: form.ubicacion,
        color: COLORES[items.length % COLORES.length],
      });
      showToast("Repuesto agregado al inventario.");
    }
    closeModal();
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleReabastecer = () => {
    const cant = Number(cantidadReabastecer);
    if (!cantidadReabastecer || isNaN(cant) || cant <= 0) { setErrorReabastecer("Ingresa una cantidad válida mayor a 0."); return; }
    const it = items[reabastecerIndex];
    if (it) actualizarItem(it.id, { stock: Number(it.stock) + cant });
    showToast(`Stock actualizado correctamente.`);
    setReabastecerIndex(null);
    setCantidadReabastecer("");
    setErrorReabastecer("");
  };

  return (
    <div className="animate-in space-y-8 pb-10">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR REPUESTO */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">{editIndex !== null ? "Editar Repuesto" : "Agregar Repuesto"}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors"><X size={22} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { field: "nombre", label: "Nombre *", placeholder: "Ej: Aceite Motul 10W40", colSpan: "sm:col-span-2" },
                { field: "marca", label: "Marca *", placeholder: "Ej: Motul Colombia" },
                { field: "codigo", label: "Código *", placeholder: "Ej: ACE-001" },
              ].map(({ field, label, placeholder, colSpan }) => (
                <div key={field} className={colSpan || ""}>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={form[field]} onChange={handleChange(field)} placeholder={placeholder}
                    className={`w-full bg-zinc-900 border ${errors[field] ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                  />
                  {errors[field] && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Categoría *</label>
                <div className="relative">
                  <select value={form.categoria} onChange={handleChange("categoria")}
                    className="appearance-none w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500/60 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none transition-all cursor-pointer">
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              {[
                { field: "stock", label: "Stock Actual *", placeholder: "Ej: 24" },
                { field: "minStock", label: "Stock Mínimo *", placeholder: "Ej: 10" },
                { field: "precio", label: "Precio Unit. *", placeholder: "Ej: $15.000" },
                { field: "ubicacion", label: "Ubicación *", placeholder: "Ej: Estante A-1" },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
                  <input value={form[field]} onChange={handleChange(field)} placeholder={placeholder}
                    className={`w-full bg-zinc-900 border ${errors[field] ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`}
                  />
                  {errors[field] && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? "Guardar Cambios" : "Agregar al Inventario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REABASTECER */}
      {reabastecerIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-white">Reabastecer Stock</h3>
              <button onClick={() => { setReabastecerIndex(null); setCantidadReabastecer(""); setErrorReabastecer(""); }} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <p className="text-zinc-400 text-sm mb-5">
              Stock actual de <span className="text-white font-bold">{items[reabastecerIndex]?.nombre}</span>: <span className="text-orange-400 font-bold">{items[reabastecerIndex]?.stock} unidades</span>
            </p>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cantidad a agregar *</label>
            <input
              type="number"
              min="1"
              value={cantidadReabastecer}
              onChange={(e) => { setCantidadReabastecer(e.target.value); setErrorReabastecer(""); }}
              placeholder="Ej: 20"
              className={`w-full bg-zinc-900 border ${errorReabastecer ? "border-red-500/70" : "border-zinc-800"} focus:border-orange-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all mb-1`}
            />
            {errorReabastecer && <p className="text-red-400 text-xs mb-4 flex items-center gap-1"><AlertCircle size={12}/>{errorReabastecer}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setReabastecerIndex(null); setCantidadReabastecer(""); setErrorReabastecer(""); }} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={handleReabastecer} className="flex-1 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-xl font-bold text-sm transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Inventario</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestiona el stock de partes y repuestos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Agregar Repuesto
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Layers size={16} /><p className="text-sm font-medium">Total Items</p></div>
          <p className="text-3xl font-black text-white">{items.length}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-2"><TrendingDown size={16} /><p className="text-sm font-medium">Stock Bajo</p></div>
          <p className="text-3xl font-black text-orange-500">{stockBajoItems.length}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><Tag size={16} /><p className="text-sm font-medium">Categorías</p></div>
          <p className="text-3xl font-black text-white">{new Set(items.map(i => i.categoria)).size}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2"><ShoppingCart size={16} /><p className="text-sm font-medium">Valor Est.</p></div>
          <p className="text-3xl font-black text-white">{(() => {
            const total = items.reduce((s, it) => {
              const precio = Number(String(it.precio).replace(/[^\d]/g, "")) || 0;
              return s + precio * (Number(it.stock) || 0);
            }, 0);
            if (total >= 1_000_000) return `$${(total / 1_000_000).toFixed(1)}M`;
            if (total >= 1_000) return `$${Math.round(total / 1_000)}K`;
            return `$${total}`;
          })()}</p>
        </div>
      </div>

      {/* ALERTA DE STOCK BAJO */}
      {stockBajoItems.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 flex gap-4 items-start shadow-lg shadow-orange-500/5">
          <AlertCircle className="text-orange-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-1">Atención: Stock Bajo ({stockBajoItems.length} items)</h3>
            <p className="text-orange-400/80 font-medium text-sm md:text-base">
              Los siguientes repuestos necesitan reabastecimiento: <span className="text-orange-300 font-bold">{stockBajoItems.map(i => i.nombre).join(', ')}</span>
            </p>
          </div>
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, código o marca..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm"
          >
            <option>Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Sin resultados */}
      {itemsFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron repuestos</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda o filtro.</p>
        </div>
      )}

      {/* PAGINACIÓN */}
      {(() => {
        const totalPages = Math.ceil(itemsFiltrados.length / ITEMS_PER_PAGE);
        const paginated = itemsFiltrados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return (
          <>
            {/* GRID DE INVENTARIO */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((item, i) => {
          const isLowStock = item.stock < item.minStock;
          const realIndex = items.indexOf(item);
          return (
            <div
              key={i}
              className={`bg-zinc-950 border ${isLowStock ? 'border-orange-500/30 shadow-orange-900/10' : 'border-zinc-800 hover:border-purple-500/30'} rounded-[2rem] p-6 hover:shadow-xl transition-all flex flex-col relative group`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.nombre}</h3>
                    <p className="text-zinc-500 text-xs font-medium mb-1">{item.marca}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-md text-xs font-bold border border-zinc-800">{item.codigo}</span>
                <span className="bg-zinc-900 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-medium border border-zinc-800">{item.categoria}</span>
                <span className="flex items-center gap-1 text-zinc-500 text-xs px-2.5 py-1"><MapPin size={12} />{item.ubicacion}</span>
              </div>
              <div className="flex items-end justify-between mb-6 mt-auto bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Stock Actual</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${isLowStock ? 'text-orange-500' : 'text-white'}`}>{item.stock}</span>
                    <span className="text-zinc-600 text-xs font-bold">/ min {item.minStock}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Precio Unit.</p>
                  <p className="text-xl font-bold text-white">{item.precio}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => openModal(realIndex)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800 flex justify-center items-center gap-2"
                >
                  <Edit3 size={16} />Editar
                </button>
                {isLowStock && (
                  <button
                    onClick={() => { setReabastecerIndex(realIndex); setCantidadReabastecer(""); setErrorReabastecer(""); }}
                    className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 py-2.5 rounded-xl text-sm font-bold transition-colors border border-orange-500/20"
                  >
                    Reabastecer
                  </button>
                )}
              </div>
            </div>
              );
              })}
            </div>

            {/* CONTROLES DE PÁGINA */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-zinc-500 text-sm">
                  Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, itemsFiltrados.length)} de {itemsFiltrados.length} repuestos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                        page === currentPage
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
};
