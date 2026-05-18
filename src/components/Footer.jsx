import React from "react";
import { Bike, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Bike size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Moto<span className="text-purple-500">Tech</span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Plataforma inteligente para la gestión de talleres de motocicletas. 
            Controla procesos, clientes y servicios en un solo lugar.
          </p>
        </div>

        {/* ENLACES */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-purple-400 transition cursor-pointer">Dashboard</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Vehículos</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Agenda</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Clientes</li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contacto</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> soporte@mototech.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +57 300 123 4567
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Colombia
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-zinc-800 text-center py-4 text-xs text-zinc-500">
        © {new Date().getFullYear()} MotoTech. Todos los derechos reservados.
      </div>
    </footer>
  );
};