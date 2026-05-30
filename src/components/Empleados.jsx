import React, { useState } from "react";
import {
  Plus, Search, Star, Users, Award, TrendingUp,
  ChevronDown, X, Check, AlertCircle, Trash2
} from "lucide-react";
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';

const ROLES = ["Mecánico Senior", "Mecánico Junior", "Especialista Eléctrico", "Auxiliar de Taller", "Administrativo"];
const ESTADOS_EMP = ["Disponible", "Ocupado", "Inactivo"];
const COLORES_EMP = ["from-blue-600 to-indigo-600", "from-purple-600 to-pink-600", "from-emerald-500 to-teal-600", "from-orange-500 to-red-600", "from-cyan-500 to-blue-600"];
const initialFormE = { nombre: "", rol: "Mecánico Senior", especialidades: "", estado: "Disponible" };

export const Empleados = () => {
  usePageTitle("Empleados");
  const {
    empleados: todos, agregarEmpleado, actualizarEmpleado, eliminarEmpleado,
    vehiculos: vehiculosTodos, asignarVehiculoAEmpleado,
  } = useApp();
  const { tallerActivo } = useAuth();
  const empleados = todos.filter(e => !e.tallerId || e.tallerId === tallerActivo?.id);
  const vehiculosMios = vehiculosTodos.filter(v => v.tallerId === tallerActivo?.id);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos los roles");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState(initialFormE);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [asignarIndex, setAsignarIndex] = useState(null);
  const [asignarVehiculoId, setAsignarVehiculoId] = useState("");

  const empleadosFiltrados = empleados.filter(e => {
    const t = busqueda.toLowerCase();
    const coincide = e.nombre.toLowerCase().includes(t) || e.rol.toLowerCase().includes(t);
    const rolOk = filtroRol === "Todos los roles" || e.rol === filtroRol;
    return coincide && rolOk;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.especialidades.trim()) e.especialidades = "Las especialidades son obligatorias.";
    return e;
  };

  const openModal = (index = null) => {
    if (index !== null) {
      const emp = empleados[index];
      setForm({ nombre: emp.nombre, rol: emp.rol, especialidades: (emp.especialidades || []).join(", "), estado: emp.estado });
      setEditIndex(index);
    } else {
      setForm(initialFormE);
      setEditIndex(null);
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setErrors({}); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const espArr = form.especialidades.split(",").map(s => s.trim()).filter(Boolean);
    const inis = form.nombre.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    if (editIndex !== null) {
      const emp = empleados[editIndex];
      actualizarEmpleado(emp.id, { nombre: form.nombre, rol: form.rol, especialidades: espArr, estado: form.estado, iniciales: inis });
      showToast("Empleado actualizado correctamente.");
    } else {
      agregarEmpleado({
        tallerId: tallerActivo?.id,
        nombre: form.nombre, iniciales: inis, rol: form.rol, estado: form.estado,
        rating: 0, especialidades: espArr, servicios: 0, eficiencia: 0,
        ingreso: new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
        avatarColor: COLORES_EMP[empleados.length % COLORES_EMP.length],
      });
      showToast("Empleado agregado correctamente.");
    }
    closeModal();
  };

  const handleDelete = (index) => {
    const emp = empleados[index];
    if (emp) eliminarEmpleado(emp.id);
    setConfirmDeleteIndex(null);
    showToast("Empleado eliminado.");
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const getStatusColor = (estado) => estado === "Disponible" ? "bg-green-500" : estado === "Ocupado" ? "bg-yellow-500" : "bg-zinc-500";

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
              <h3 className="text-xl font-black text-white">{editIndex !== null ? "Editar Empleado" : "Nuevo Empleado"}</h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Nombre Completo *</label>
                <input value={form.nombre} onChange={handleChange("nombre")} placeholder="Ej: Juan Perez"
                  className={`w-full bg-zinc-900 border ${errors.nombre ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.nombre && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.nombre}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Rol</label>
                  <div className="relative">
                    <select value={form.rol} onChange={handleChange("rol")}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Estado</label>
                  <div className="relative">
                    <select value={form.estado} onChange={handleChange("estado")}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                      {ESTADOS_EMP.map(e => <option key={e}>{e}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Especialidades * (separadas por comas)</label>
                <input value={form.especialidades} onChange={handleChange("especialidades")} placeholder="Ej: Motor, Frenos, Transmision"
                  className={`w-full bg-zinc-900 border ${errors.especialidades ? "border-red-500/70" : "border-zinc-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-600 outline-none transition-all`} />
                {errors.especialidades && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.especialidades}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={closeModal} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm transition-colors">Cancelar</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
                {editIndex !== null ? "Guardar Cambios" : "Agregar Empleado"}
              </button>
            </div>
          </div>
        </div>
      )}

      {perfil && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Perfil del Empleado</h3>
              <button onClick={() => setPerfil(null)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${perfil.avatarColor} flex items-center justify-center text-white font-black text-2xl shadow-inner`}>{perfil.iniciales}</div>
              <div>
                <h4 className="text-white font-black text-xl">{perfil.nombre}</h4>
                <p className="text-zinc-400 font-medium">{perfil.rol}</p>
                <div className="flex items-center gap-1.5 mt-1"><div className={`w-2 h-2 rounded-full ${getStatusColor(perfil.estado)}`}></div><span className="text-xs text-zinc-400">{perfil.estado}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Servicios completados", value: perfil.servicios },
                { label: "Eficiencia", value: `${perfil.eficiencia}%` },
                { label: "Rating", value: `${perfil.rating} / 5.0` },
                { label: "En el equipo desde", value: perfil.ingreso },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-500 text-sm">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
              <div className="py-3">
                <p className="text-zinc-500 text-sm mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-2">{perfil.especialidades.map((e, i) => <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg font-medium">{e}</span>)}</div>
              </div>
            </div>
            <button onClick={() => setPerfil(null)} className="w-full mt-6 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      {asignarIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center"><Award size={22} className="text-purple-400" /></div>
                <div>
                  <h3 className="text-lg font-black text-white">Asignar vehículo</h3>
                  <p className="text-xs text-zinc-500">A {empleados[asignarIndex]?.nombre}</p>
                </div>
              </div>
              <button onClick={() => { setAsignarIndex(null); setAsignarVehiculoId(""); }} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            {(() => {
              const pendientes = vehiculosMios.filter(v => v.estado !== "Finalizada" && (!v.tecnico || v.tecnico === "Por asignar"));
              if (pendientes.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 mb-1 font-semibold">No hay servicios pendientes</p>
                    <p className="text-zinc-600 text-sm">Todos los vehículos en taller ya tienen técnico asignado.</p>
                  </div>
                );
              }
              return (
                <>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Vehículo a asignar</label>
                  <div className="relative mb-5">
                    <select value={asignarVehiculoId} onChange={(e) => setAsignarVehiculoId(e.target.value)}
                      className="appearance-none w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
                      <option value="">-- Selecciona un vehículo --</option>
                      {pendientes.map(v => (
                        <option key={v.id} value={v.id}>{v.marca} {v.modelo} • {v.placa} • {v.cliente}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setAsignarIndex(null); setAsignarVehiculoId(""); }} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
                    <button disabled={!asignarVehiculoId} onClick={() => {
                      const emp = empleados[asignarIndex];
                      asignarVehiculoAEmpleado(asignarVehiculoId, emp.nombre);
                      actualizarEmpleado(emp.id, { estado: "Ocupado", servicios: (emp.servicios || 0) + 1 });
                      showToast(`Vehículo asignado a ${emp.nombre}`);
                      setAsignarIndex(null); setAsignarVehiculoId("");
                    }} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-all">Asignar</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={32} className="text-red-400" /></div>
            <h3 className="text-xl font-black text-white mb-2">Eliminar Empleado</h3>
            <p className="text-zinc-400 text-sm mb-7">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteIndex(null)} className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={() => handleDelete(confirmDeleteIndex)} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Personal</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra el equipo, métricas y asignaciones</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: empleados.length, label: "En Turno", color: "text-blue-500", bg: "bg-blue-500/10", Icon: Users },
          { value: (empleados.reduce((s, e) => s + e.rating, 0) / (empleados.length || 1)).toFixed(2), label: "Rating Promedio", color: "text-green-500", bg: "bg-green-500/10", Icon: Star },
          { value: empleados.reduce((s, e) => s + e.servicios, 0).toLocaleString(), label: "Servicios Totales", color: "text-purple-500", bg: "bg-purple-500/10", Icon: Award },
          { value: `${Math.round(empleados.reduce((s, e) => s + e.eficiencia, 0) / (empleados.length || 1))}%`, label: "Eficiencia", color: "text-orange-500", bg: "bg-orange-500/10", Icon: TrendingUp },
        ].map(({ value, label, color, bg, Icon }, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0`}><Icon size={28} /></div>
            <div><p className="text-3xl font-black text-white">{value}</p><p className="text-zinc-500 text-sm font-medium">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o rol..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm" />
        </div>
        <div className="relative">
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}
            className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none cursor-pointer shadow-sm">
            <option>Todos los roles</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {empleadosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
          <Search size={40} className="mb-4 text-zinc-700" />
          <p className="font-bold text-lg">No se encontraron empleados</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {empleadosFiltrados.map((emp, i) => {
          const realIndex = empleados.indexOf(emp);
          return (
            <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-inner`}>{emp.iniciales}</div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{emp.nombre}</h3>
                    <p className="text-zinc-500 text-sm font-medium">{emp.rol}</p>
                    <div className="flex items-center gap-1.5 mt-1"><div className={`w-2 h-2 rounded-full ${getStatusColor(emp.estado)}`}></div><span className="text-xs text-zinc-400 font-medium">{emp.estado}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-white font-bold text-sm">{emp.rating}</span></div>
              </div>
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-2">{emp.especialidades.map((esp, index) => <span key={index} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg font-medium">{esp}</span>)}</div>
              </div>
              <div className="flex items-end justify-between mb-6 mt-auto">
                <div><p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Servicios Comp.</p><p className="text-2xl font-black text-white">{emp.servicios}</p></div>
                <div className="w-1/2">
                  <div className="flex justify-between items-end mb-1"><p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Eficiencia</p><p className="text-sm font-bold text-white">{emp.eficiencia}%</p></div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${emp.eficiencia}%` }}></div></div>
                </div>
              </div>
              <div className="border-t border-zinc-800/80 pt-5">
                <p className="text-xs text-zinc-500 font-medium mb-4">En el equipo desde <span className="text-zinc-300">{emp.ingreso}</span></p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPerfil(emp)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">Ver Perfil</button>
                  <button onClick={() => setAsignarIndex(realIndex)} className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 py-2.5 rounded-xl text-sm font-bold transition-colors">Asignar Servicio</button>
                  <button onClick={() => openModal(realIndex)} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors"><Check size={16}/></button>
                  <button onClick={() => setConfirmDeleteIndex(realIndex)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
