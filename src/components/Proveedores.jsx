import React, { useState } from "react";
import {
  Plus, Search, Building2, Star, Phone, Mail,
  Package, ShoppingCart, ChevronDown, Edit2, TrendingUp, X, Check, AlertCircle, Trash2,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";
import { validarEmail, validarTelefono, requerido, validarFormulario } from "../utils/validaciones";

const CATS_PROV = ["Lubricantes", "Filtros", "Repuestos", "Llantas", "Herramientas", "Eléctrico", "Otros"];
const COLORES_P = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const initialFormP = { nombre: "", categoria: "Lubricantes", telefono: "", email: "", productos: "", estado: "Activo" };

export const Proveedores = () => {
  usePageTitle("Proveedores");
  const { proveedores: todos, agregarProveedor, actualizarProveedor, eliminarProveedor } = useApp();
  const { tallerActivo } = useAuth();
  const proveedores = todos.filter((p) => !p.tallerId || p.tallerId === tallerActivo?.id);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas las categorías");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialFormP);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const t = busqueda.toLowerCase();
    const coincide =
      p.nombre.toLowerCase().includes(t) ||
      p.email.toLowerCase().includes(t) ||
      p.telefono.toLowerCase().includes(t);
    const catOk = filtroCategoria === "Todas las categorías" || p.categoria === filtroCategoria;
    return coincide && catOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () =>
    validarFormulario(form, {
      nombre:   [requerido],
      telefono: [validarTelefono],
      email:    [validarEmail],
    });

  const openModal = (prov = null) => {
    if (prov) {
      setForm({
        nombre: prov.nombre, categoria: prov.categoria,
        telefono: prov.telefono, email: prov.email,
        productos: (prov.productos || []).join(", "), estado: prov.estado,
      });
      setEditId(prov.id);
    } else {
      setForm(initialFormP);
      setEditId(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const prodsArr = form.productos.split(",").map((p) => p.trim()).filter(Boolean);
    if (editId) {
      actualizarProveedor(editId, {
        nombre: form.nombre, categoria: form.categoria,
        telefono: form.telefono, email: form.email,
        productos: prodsArr, estado: form.estado,
      });
      showToast("Proveedor actualizado correctamente.");
    } else {
      agregarProveedor({
        tallerId: tallerActivo?.id,
        nombre: form.nombre, categoria: form.categoria,
        rating: 4.5, telefono: form.telefono, email: form.email,
        productos: prodsArr, totalOrdenes: 0, ultimaOrden: "—",
        avatarColor: COLORES_P[proveedores.length % COLORES_P.length],
        estado: form.estado,
      });
      showToast("Proveedor creado correctamente.");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    eliminarProveedor(id);
    setConfirmDeleteId(null);
    showToast("Proveedor eliminado.");
  };

  const handleNuevaOrden = (prov) => {
    actualizarProveedor(prov.id, {
      totalOrdenes: (prov.totalOrdenes || 0) + 1,
      ultimaOrden: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
    });
    showToast("Nueva orden registrada.");
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const activosCount = proveedores.filter((p) => p.estado === "Activo").length;
  const totalOrdenes = proveedores.reduce((s, p) => s + (p.totalOrdenes || 0), 0);
  const avgRating = (proveedores.reduce((s, p) => s + (p.rating || 0), 0) / (proveedores.length || 1)).toFixed(1);

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
              <h3 className="text-xl font-black text-white">{editId ? "Editar Proveedor" : "Nuevo Proveedor"}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Nombre *" error={errors.nombre}>
                <input value={form.nombre} onChange={handleChange("nombre")} placeholder="Nombre del proveedor" className={inputCls(errors.nombre)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoría">
                  <SelectCustom value={form.categoria} onChange={handleChange("categoria")} options={CATS_PROV} />
                </Field>
                <Field label="Estado">
                  <SelectCustom value={form.estado} onChange={handleChange("estado")} options={["Activo", "Inactivo"]} />
                </Field>
              </div>
              <Field label="Teléfono * (10 dígitos)" error={errors.telefono}>
                <input value={form.telefono} onChange={handleChange("telefono")} placeholder="Ej: 3001234567" inputMode="numeric" maxLength={14} className={inputCls(errors.telefono)} />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input value={form.email} onChange={handleChange("email")} placeholder="correo@proveedor.com" type="email" className={inputCls(errors.email)} />
              </Field>
              <Field label="Productos (separados por comas)">
                <input value={form.productos} onChange={handleChange("productos")} placeholder="Ej: Aceites, Filtros, Aditivos" className={inputCls()} />
              </Field>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editId ? "Guardar Cambios" : "Crear Proveedor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Detalle del Proveedor</h3>
              <button onClick={() => setDetalle(null)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${detalle.avatarColor} flex items-center justify-center text-white`}><Building2 size={28} /></div>
              <div>
                <h4 className="text-white font-black text-xl">{detalle.nombre}</h4>
                <span className="inline-block mt-1 bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-medium border border-zinc-800">{detalle.categoria}</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Teléfono",      value: detalle.telefono },
                { label: "Email",         value: detalle.email },
                { label: "Total órdenes", value: detalle.totalOrdenes },
                { label: "Última orden",  value: detalle.ultimaOrden },
                { label: "Rating",        value: `${detalle.rating} / 5.0` },
                { label: "Estado",        value: detalle.estado },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-500 text-sm">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
              <div className="py-3">
                <p className="text-zinc-500 text-sm mb-2">Productos</p>
                <div className="flex flex-wrap gap-2">
                  {(detalle.productos || []).map((p, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-purple-500/20">{p}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setDetalle(null)} className="w-full mt-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-800">Cerrar</button>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar proveedor</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Proveedores</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra proveedores, repuestos y órdenes de compra</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: proveedores.length, label: "Total Proveedores",  color: "text-blue-500",   bg: "bg-blue-500/10",   Icon: Building2 },
          { value: activosCount,        label: "Proveedores Activos",color: "text-green-500",  bg: "bg-green-500/10",  Icon: TrendingUp },
          { value: totalOrdenes,        label: "Total Órdenes",      color: "text-purple-500", bg: "bg-purple-500/10", Icon: ShoppingCart },
          { value: avgRating,           label: "Rating Promedio",    color: "text-yellow-500", bg: "bg-yellow-500/10", Icon: Star },
        ].map(({ value, label, color, bg, Icon }, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0`}><Icon size={28} /></div>
            <div><p className="text-3xl font-black text-white">{value}</p><p className="text-zinc-500 text-sm font-medium">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o contacto..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none" />
        </div>
        <div className="relative">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none cursor-pointer">
            <option>Todas las categorías</option>
            {CATS_PROV.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {proveedoresFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron proveedores</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {proveedoresFiltrados.map((prov) => (
          <div key={prov.id} className={`bg-zinc-950 border ${prov.estado === "Inactivo" ? "border-zinc-800/50 opacity-75" : "border-zinc-800 hover:border-purple-500/30"} rounded-[2rem] p-6 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prov.avatarColor} flex items-center justify-center text-white`}><Building2 size={24} /></div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{prov.nombre}</h3>
                  <span className="inline-block mt-1 bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-medium border border-zinc-800">{prov.categoria}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-white font-bold text-sm">{prov.rating}</span></div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-zinc-400"><Phone size={16} className="text-zinc-500" /><span className="text-sm">{prov.telefono}</span></div>
              <div className="flex items-center gap-3 text-zinc-400"><Mail size={16} className="text-zinc-500" /><span className="text-sm">{prov.email}</span></div>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3"><Package size={16} className="text-zinc-500" /><p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Productos</p></div>
              <div className="flex flex-wrap gap-2">
                {(prov.productos || []).map((prod, index) => (
                  <span key={index} className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-purple-500/20">{prod}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 mt-auto bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
              <div><p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Total órdenes</p><p className="text-xl font-black text-white">{prov.totalOrdenes}</p></div>
              <div className="text-right"><p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Última orden</p><p className="text-sm font-bold text-white">{prov.ultimaOrden}</p></div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button onClick={() => setDetalle(prov)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">Ver Detalles</button>
              <button onClick={() => handleNuevaOrden(prov)} className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 py-2.5 rounded-xl text-sm font-bold transition-colors">Nueva Orden</button>
              <button onClick={() => openModal(prov)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white p-2.5 rounded-xl transition-colors border border-zinc-800"><Edit2 size={18} /></button>
              <button onClick={() => setConfirmDeleteId(prov.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const inputCls = (err) =>
  `w-full bg-zinc-900 border ${err ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
  </div>
);

const SelectCustom = ({ value, onChange, options }) => (
  <div className="relative">
    <select value={value} onChange={onChange} className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
  </div>
);
