import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bike, Calendar, User as UserIcon, ChevronRight, Clock, CheckCircle, AlertCircle, Plus, X, ChevronDown, Check } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useApp } from "../../context/AppContext";
import { usePageTitle } from "../../hooks/usePageTitle";
import { validarPlaca, validarAnio, requerido, validarFormulario } from "../../utils/validaciones";

const estadoStyle = {
  "En Proceso":  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Finalizada":  "bg-green-500/10 text-green-400 border-green-500/30",
  "Sin Atender": "bg-orange-500/10 text-orange-400 border-orange-500/30",
};
const estadoIcon = {
  "En Proceso":  <Clock size={14} />,
  "Finalizada":  <CheckCircle size={14} />,
  "Sin Atender": <AlertCircle size={14} />,
};

const MARCAS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Bajaj", "AKT", "TVS", "KTM", "Royal Enfield", "Otra"];
const COLORES = ["Rojo", "Azul", "Negro", "Blanco", "Gris", "Verde", "Amarillo", "Naranja", "Plateado", "Otro"];

const initial = { placa: "", marca: "Honda", modelo: "", año: String(new Date().getFullYear()), color: "Rojo" };

export const ClienteDashboard = () => {
  usePageTitle("Mis motos");
  const { user, tallerActivo } = useAuth();
  const { vehiculos, agregarVehiculo } = useApp();
  const motos = vehiculos.filter(v => v.clienteUsuarioId === user?.id);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const handle = (f) => (e) => { setForm(p => ({ ...p, [f]: e.target.value })); if (errors[f]) setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () =>
    validarFormulario(form, {
      placa:  [validarPlaca],
      marca:  [requerido],
      modelo: [requerido],
      año:   [validarAnio],
      color:  [requerido],
    });

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    agregarVehiculo({
      tallerId: tallerActivo?.id,
      clienteUsuarioId: user.id,
      placa: form.placa.toUpperCase(),
      marca: form.marca, modelo: form.modelo,
      año: form.año, color: form.color,
      cliente: user.nombre, telefono: user.telefono || "",
      estado: "Sin Atender", avance: 0, tecnico: "Por asignar",
      ingreso: new Date().toLocaleDateString("es-CO"),
      entregaEstimada: "Por confirmar",
      diagnostico: "",
      serviciosCotizados: [],
      historial: [{ titulo: "Moto registrada por el cliente", descripcion: "El cliente registró la moto desde el portal.", fecha: new Date().toLocaleDateString("es-CO"), visibleCliente: true }],
    });
    showToast("Moto registrada. El taller será notificado.");
    setForm(initial); setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-white">Registrar mi moto</h3>
                <p className="text-gray-500 text-sm mt-0.5">Tu taller será notificado para coordinar el servicio.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={22}/></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Placa *" error={errors.placa}>
                  <input value={form.placa} onChange={handle("placa")} placeholder="ABC123" className={cls(errors.placa)} />
                </Field>
                <Field label="Año *" error={errors.año}>
                  <input value={form.año} onChange={handle("año")} inputMode="numeric" maxLength={4} className={cls(errors.año)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Marca *" error={errors.marca}>
                  <Select value={form.marca} onChange={handle("marca")} options={MARCAS}/>
                </Field>
                <Field label="Modelo *" error={errors.modelo}>
                  <input value={form.modelo} onChange={handle("modelo")} placeholder="CB 190R" className={cls(errors.modelo)} />
                </Field>
              </div>
              <Field label="Color *" error={errors.color}>
                <Select value={form.color} onChange={handle("color")} options={COLORES}/>
              </Field>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={submit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm">Registrar moto</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Hola, {user?.nombre?.split(" ")[0]} 👋</h1>
          <p className="text-gray-400 mt-1 text-sm">Este es el estado actual de tus motos en el taller.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">
          <Plus size={18}/> Registrar mi moto
        </button>
      </div>

      {motos.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-10 text-center">
          <Bike size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-300 font-medium">Aún no tienes motos registradas</p>
          <p className="text-sm text-gray-500 mt-1">Pulsa <span className="text-purple-400 font-semibold">"Registrar mi moto"</span> para empezar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motos.map((moto) => (
            <Link key={moto.id} to={`/cliente/moto/${moto.id}`}
              className="bg-gray-900/60 border border-gray-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center"><Bike size={22} className="text-purple-400" /></div>
                  <div>
                    <h3 className="text-white font-semibold">{moto.marca} {moto.modelo}</h3>
                    <p className="text-xs text-gray-500">{moto.placa} · {moto.año} · {moto.color}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${estadoStyle[moto.estado] || estadoStyle["Sin Atender"]}`}>
                  {estadoIcon[moto.estado] || estadoIcon["Sin Atender"]} {moto.estado}
                </span>
                {moto.ordenServicio && <span className="text-xs text-gray-500">{moto.ordenServicio}</span>}
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Avance</span><span>{moto.avance || 0}%</span></div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${moto.avance || 0}%` }}/>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> Entrega: {moto.entregaEstimada || "Por confirmar"}</span>
                <span className="flex items-center gap-1.5"><UserIcon size={12} /> {moto.tecnico || "Por asignar"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const cls = (err) => `w-full bg-gray-900 border ${err ? "border-red-500/60" : "border-gray-800"} focus:border-purple-500/60 rounded-xl py-2.5 px-4 text-white outline-none uppercase`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-purple-300 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <div className="relative">
    <select value={value} onChange={onChange} className="appearance-none w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-4 pr-10 text-white outline-none cursor-pointer">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
  </div>
);
