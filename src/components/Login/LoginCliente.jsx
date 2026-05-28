import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { clientesDemo } from "../../data/clientes";

export const LoginCliente = () => {
  const navigate = useNavigate();
  const { loginCliente } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = loginCliente(form.email, form.password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate("/cliente", { replace: true });
  };

  const cuentasDemo = clientesDemo.map((c) => `${c.email} / ${c.password}`).join(" · ");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Cambiar tipo de cuenta
        </button>

        <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <User size={24} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Acceso de Cliente</h1>
              <p className="text-xs text-gray-400">Consulta el estado de tu moto</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Correo</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="tu@correo.co"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-opacity"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            ¿Primera vez aquí?{" "}
            <Link to="/registro/cliente" className="text-purple-400 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>

        <p className="text-[11px] text-gray-600 text-center mt-4">
          Cuentas demo: {cuentasDemo}
        </p>
      </div>
    </div>
  );
};
