import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, User, Bike } from "lucide-react";

export const SeleccionRol = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border border-cyan-500/20 shadow-xl shadow-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm group mx-auto">
          
          <img
            src="/Logo_MotoTech.jpeg"
            alt="Logo MotoTech"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
        </div>
          <h1 className="text-4xl font-bold text-white mb-2 p-4">MotoTech</h1>
          <p className="text-gray-400">Selecciona cómo deseas ingresar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/login/taller")}
            className="group bg-gray-900/70 backdrop-blur border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 flex items-center justify-center mb-4 transition-colors">
              <Wrench size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Soy un Taller</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Administra vehículos, órdenes de servicio, clientes, inventario y reportes de tu taller.
            </p>
            <p className="mt-4 text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Ingresar como taller →
            </p>
          </button>

          <button
            onClick={() => navigate("/login/cliente")}
            className="group bg-gray-900/70 backdrop-blur border border-gray-800 hover:border-purple-500/50 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-colors">
              <User size={28} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Soy Cliente</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Consulta el estado de tu moto, evidencias del proceso y fecha estimada de entrega.
            </p>
            <p className="mt-4 text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Ingresar como cliente →
            </p>
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-10">
          © {new Date().getFullYear()} MotoTech · Plataforma de gestión de talleres
        </p>
      </div>
    </div>
  );
};
