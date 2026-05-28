import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import empresa from "../config/empresa";

export const Footer = () => {
  const año = new Date().getFullYear();
  return (
    <footer className="bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-zinc-800 p-2 rounded-lg text-lg leading-none">
              {empresa.logoEmoji || "🏍️"}
            </div>
            <h2 className="text-lg font-bold text-white">{empresa.nombre}</h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {empresa.eslogan || "Plataforma de gestión para talleres de motocicletas."}
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Dashboard</li>
            <li>Vehículos</li>
            <li>Agenda</li>
            <li>Clientes</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Contacto</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            {empresa.email && (
              <li className="flex items-center gap-2"><Mail size={16} /> {empresa.email}</li>
            )}
            {empresa.telefono && (
              <li className="flex items-center gap-2"><Phone size={16} /> {empresa.telefono}</li>
            )}
            {empresa.direccion && (
              <li className="flex items-center gap-2"><MapPin size={16} /> {empresa.direccion}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 text-center py-4 text-xs text-zinc-500">
        © {año} {empresa.nombre}. Todos los derechos reservados.
      </div>
    </footer>
  );
};
