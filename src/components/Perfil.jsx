import React, { useState, useRef, useEffect } from "react";
import { Camera, Mail, Phone, MapPin, Edit3, Save, X, AlertCircle, Building2, Check } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../auth/AuthContext";
import { useApp } from "../context/AppContext";
import { validarEmail, validarTelefono, requerido, validarFormulario } from "../utils/validaciones";

export function Perfil() {
  usePageTitle("Perfil del Taller");
  const { tallerActivo } = useAuth();
  const { actualizarTaller } = useApp();
  const fileRef = useRef(null);

  const [editando, setEditando] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", direccion: "",
    ciudad: "", horario: "", descripcion: "", nit: "",
    logoBase64: null,
  });

  useEffect(() => {
    if (tallerActivo) {
      setForm({
        nombre: tallerActivo.nombre || "",
        email: tallerActivo.email || "",
        telefono: tallerActivo.telefono || "",
        direccion: tallerActivo.direccion || "",
        ciudad: tallerActivo.ciudad || "",
        horario: tallerActivo.horario || "",
        descripcion: tallerActivo.descripcion || "",
        nit: tallerActivo.nit || "",
        logoBase64: tallerActivo.logoBase64 || null,
      });
    }
  }, [tallerActivo]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Selecciona una imagen válida."); return; }
    if (file.size > 1024 * 1024) { showToast("La imagen debe pesar menos de 1MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, logoBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () =>
    validarFormulario(form, {
      nombre:    [requerido],
      email:     [validarEmail],
      telefono:  [validarTelefono],
      direccion: [requerido],
    });

  const handleGuardar = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    actualizarTaller(tallerActivo.id, { ...form });
    setEditando(false);
    showToast("Información del taller actualizada.");
  };

  const handleCancelar = () => {
    setForm({
      nombre: tallerActivo.nombre || "",
      email: tallerActivo.email || "",
      telefono: tallerActivo.telefono || "",
      direccion: tallerActivo.direccion || "",
      ciudad: tallerActivo.ciudad || "",
      horario: tallerActivo.horario || "",
      descripcion: tallerActivo.descripcion || "",
      nit: tallerActivo.nit || "",
      logoBase64: tallerActivo.logoBase64 || null,
    });
    setErrors({});
    setEditando(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Perfil del Taller</h1>
          <p className="text-gray-400 text-sm mt-1">Información pública de tu taller</p>
        </div>
        {!editando ? (
          <button onClick={() => setEditando(true)} className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            <Edit3 size={16}/> Editar perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancelar} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-bold">
              <X size={16}/> Cancelar
            </button>
            <button onClick={handleGuardar} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">
              <Save size={16}/> Guardar cambios
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-3xl border-4 border-gray-900 shadow-lg overflow-hidden">
                {form.logoBase64
                  ? <img src={form.logoBase64} alt="Logo" className="w-full h-full object-cover" />
                  : (tallerActivo?.iniciales || "MT")
                }
              </div>
              {editando && (
                <>
                  <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center border-2 border-gray-900 transition-colors">
                    <Camera size={14} className="text-white" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                </>
              )}
            </div>
            <div className="mb-1 flex-1 min-w-0">
              <p className="font-black text-white text-2xl leading-tight truncate">{form.nombre || "Mi Taller"}</p>
              <p className="text-gray-400 text-sm">{tallerActivo?.eslogan || "Tu taller en MotoTech"}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Chip icon={Mail}     value={form.email} fallback="Sin correo"/>
            <Chip icon={MapPin}   value={form.ciudad} fallback="Sin ciudad"/>
            <Chip icon={Phone}    value={form.telefono} fallback="Sin teléfono"/>
            <Chip icon={Building2} value={form.nit} fallback="Sin NIT"/>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Información del taller</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombre del taller *" error={errors.nombre}>
            <input disabled={!editando} value={form.nombre} onChange={handleChange("nombre")} className={inputCls(editando, errors.nombre)} />
          </FormField>
          <FormField label="NIT">
            <input disabled={!editando} value={form.nit} onChange={handleChange("nit")} className={inputCls(editando)} />
          </FormField>
          <FormField label="Correo *" error={errors.email}>
            <input disabled={!editando} type="email" value={form.email} onChange={handleChange("email")} className={inputCls(editando, errors.email)} />
          </FormField>
          <FormField label="Teléfono * (10 dígitos)" error={errors.telefono}>
            <input disabled={!editando} value={form.telefono} onChange={handleChange("telefono")} inputMode="numeric" maxLength={14} className={inputCls(editando, errors.telefono)} />
          </FormField>
          <FormField label="Dirección *" error={errors.direccion}>
            <input disabled={!editando} value={form.direccion} onChange={handleChange("direccion")} className={inputCls(editando, errors.direccion)} />
          </FormField>
          <FormField label="Ciudad">
            <input disabled={!editando} value={form.ciudad} onChange={handleChange("ciudad")} className={inputCls(editando)} />
          </FormField>
          <FormField label="Horario de atención" colSpan>
            <input disabled={!editando} value={form.horario} onChange={handleChange("horario")} placeholder="Lun-Sáb 8:00 AM - 6:00 PM" className={inputCls(editando)} />
          </FormField>
          <FormField label="Descripción del taller" colSpan>
            <textarea disabled={!editando} rows={4} value={form.descripcion} onChange={handleChange("descripcion")}
              placeholder="Cuéntales a tus clientes qué hace especial a tu taller..."
              className={`${inputCls(editando)} resize-none`} />
          </FormField>
        </div>
      </div>
    </div>
  );
}

const inputCls = (editable, error) =>
  `w-full rounded-xl px-4 py-2.5 text-sm text-gray-100 outline-none transition-colors ${
    editable
      ? `bg-gray-800 border ${error ? "border-red-500/70" : "border-gray-700"} focus:border-cyan-500`
      : "bg-gray-900/60 border border-gray-800 cursor-not-allowed text-gray-400"
  }`;

const FormField = ({ label, error, colSpan, children }) => (
  <div className={colSpan ? "sm:col-span-2" : ""}>
    <label className="block text-xs font-medium text-cyan-400 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
  </div>
);

const Chip = ({ icon: Icon, value, fallback }) => (
  <div className="flex items-center gap-2 text-sm text-gray-300">
    <Icon size={15} className="text-cyan-400 flex-shrink-0" />
    <span className="truncate">{value || <span className="text-gray-500 italic">{fallback}</span>}</span>
  </div>
);
