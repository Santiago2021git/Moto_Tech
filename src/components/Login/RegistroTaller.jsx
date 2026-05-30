import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, ArrowLeft, Check, Upload } from "lucide-react";
import { useApp } from "../../context/AppContext";

const initial = {
  nombre: "",
  nit: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  horario: "",
  eslogan: "",
  color: "cyan",
  logo: null, // data URL
  consentimiento: false,
};

export const RegistroTaller = () => {
  const navigate = useNavigate();
  const { registrarTaller, talleres } = useApp();
  const [form, setForm] = useState(initial);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.consentimiento) return;
    if (talleres.some(t => t.usuario?.toLowerCase() === form.email.toLowerCase())) {
      setError("Ya existe un taller con ese correo.");
      return;
    }
    registrarTaller({
      nombre: form.nombre,
      nit: form.nit,
      email: form.email,
      usuario: form.email,
      password: form.password,
      telefono: form.telefono,
      direccion: form.direccion,
      ciudad: form.ciudad,
      horario: form.horario,
      eslogan: form.eslogan,
      color: form.color,
      logo: form.logo,
      logoEmoji: form.logo ? undefined : "🔧",
    });
    setOk(true);
    setTimeout(() => navigate("/login/taller"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full my-10">
        <button
          onClick={() => navigate("/login/taller")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Volver al login
        </button>

        <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Wrench size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Registrar Taller</h1>
              <p className="text-xs text-gray-400">
                Personaliza la plataforma con la identidad de tu taller (marca blanca)
              </p>
            </div>
          </div>

          {ok ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <p className="text-white font-medium">¡Taller registrado!</p>
              <p className="text-sm text-gray-400 mt-1">Te redirigimos al inicio de sesión…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <section>
                <h2 className="text-sm font-semibold text-cyan-400 mb-3">Identidad del taller</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nombre comercial *" value={form.nombre} onChange={set("nombre")} required />
                  <Field label="NIT *" value={form.nit} onChange={set("nit")} required />
                  <Field label="Eslogan" value={form.eslogan} onChange={set("eslogan")} />
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Color principal</label>
                    <select
                      value={form.color}
                      onChange={set("color")}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    >
                      <option value="cyan">Cyan</option>
                      <option value="orange">Naranja</option>
                      <option value="purple">Púrpura</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1.5">Logo del taller</label>
                  <label className="flex items-center gap-3 bg-gray-950 border border-dashed border-gray-700 rounded-lg px-3 py-3 cursor-pointer hover:border-cyan-500/50 transition-colors">
                    {form.logo ? (
                      <img src={form.logo} alt="logo" className="w-12 h-12 rounded-md object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center">
                        <Upload size={20} className="text-gray-500" />
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="text-white">{form.logo ? "Cambiar logo" : "Subir logo (PNG/JPG)"}</p>
                      <p className="text-xs text-gray-500">Recomendado: cuadrado, 512x512px</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-cyan-400 mb-3">Contacto y operación</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Correo de contacto *" value={form.email} onChange={set("email")} required type="email" />
                  <Field label="Teléfono *" value={form.telefono} onChange={set("telefono")} required type="tel" />
                  <Field label="Ciudad" value={form.ciudad} onChange={set("ciudad")} />
                  <Field label="Horario de atención" value={form.horario} onChange={set("horario")} placeholder="Lun-Sáb 8:00 - 18:00" />
                </div>
                <div className="mt-3">
                  <Field label="Dirección" value={form.direccion} onChange={set("direccion")} />
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-cyan-400 mb-3">Cuenta de administrador</h2>
                <Field label="Contraseña *" value={form.password} onChange={set("password")} required type="password" minLength={6} />
              </section>

              <label className="flex items-start gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={form.consentimiento}
                  onChange={set("consentimiento")}
                  className="mt-0.5 accent-cyan-500"
                  required
                />
                <span>
                  Acepto los términos y políticas de privacidad de MotoTech y autorizo el tratamiento
                  de datos conforme a la Ley 1581 de 2012.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-opacity"
              >
                Registrar taller
              </button>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            ¿Tu taller ya está registrado?{" "}
            <Link to="/login/taller" className="text-cyan-400 hover:underline">
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
        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
      />
    </div>
  );
}
