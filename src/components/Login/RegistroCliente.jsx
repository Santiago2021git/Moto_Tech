import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ArrowLeft, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";

const initial = {
  nombre: "",
  documento: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
  tallerId: "",
  consentimiento: false,
};

export const RegistroCliente = () => {
  const navigate = useNavigate();
  const { registrarCliente, usuariosCliente, talleres } = useApp();
  const [form, setForm] = useState({ ...initial, tallerId: talleres[0]?.id || "" });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.consentimiento) return;
    if (usuariosCliente.some(u => u.email?.toLowerCase() === form.email.toLowerCase())) {
      setError("Ya existe una cuenta con ese correo.");
      return;
    }
    registrarCliente({
      tallerId: form.tallerId || talleres[0]?.id,
      nombre: form.nombre,
      documento: form.documento,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
      direccion: form.direccion,
    });
    setOk(true);
    setTimeout(() => navigate("/login/cliente"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <button
          onClick={() => navigate("/login/cliente")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Volver al login
        </button>

        <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <User size={24} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Registro de Cliente</h1>
              <p className="text-xs text-gray-400">Crea tu cuenta para hacer seguimiento a tu moto</p>
            </div>
          </div>

          {ok ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <p className="text-white font-medium">¡Cuenta creada!</p>
              <p className="text-sm text-gray-400 mt-1">Te redirigimos al inicio de sesión…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nombre completo" value={form.nombre} onChange={set("nombre")} required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Documento" value={form.documento} onChange={set("documento")} required />
                <Field label="Teléfono" value={form.telefono} onChange={set("telefono")} required type="tel" />
              </div>
              <Field label="Correo" value={form.email} onChange={set("email")} required type="email" />
              <Field label="Contraseña" value={form.password} onChange={set("password")} required type="password" minLength={6} />
              <Field label="Dirección" value={form.direccion} onChange={set("direccion")} />

              {talleres.length > 1 && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Taller asociado</label>
                  <select
                    value={form.tallerId}
                    onChange={set("tallerId")}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  >
                    {talleres.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
              )}

              <label className="flex items-start gap-2 text-xs text-gray-400 pt-2">
                <input
                  type="checkbox"
                  checked={form.consentimiento}
                  onChange={set("consentimiento")}
                  className="mt-0.5 accent-purple-500"
                  required
                />
                <span>
                  Acepto el tratamiento de mis datos personales conforme a la Ley 1581 de 2012 y las
                  políticas de privacidad de MotoTech.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-opacity"
              >
                Crear cuenta
              </button>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login/cliente" className="text-purple-400 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
      />
    </div>
  );
}
