import React, { useState } from "react";
import { Mail, Phone, MapPin, LayoutDashboard, Bike, CalendarDays, Users, ExternalLink, Copy, Check, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import empresa from "../config/empresa";

const navLinks = [
  { label: "Dashboard",  icon: LayoutDashboard, path: "/dashboard" },
  { label: "Vehículos",  icon: Bike,            path: "/vehiculos" },
  { label: "Agenda",     icon: CalendarDays,     path: "/agenda" },
  { label: "Clientes",   icon: Users,            path: "/clientes" },
];

export const Footer = () => {
  const año = new Date().getFullYear();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/60 mt-10 overflow-hidden">

      {/* Glow de fondo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* ── Marca ── */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                {empresa.logoEmoji || "🏍️"}
              </div>
              <div>
                <h2 className="text-white font-black text-lg tracking-tight leading-none">{empresa.nombre}</h2>
                <p className="text-zinc-500 text-xs mt-0.5 font-medium">Sistema de gestión</p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              {empresa.eslogan || "Plataforma de gestión para talleres de motocicletas."}
            </p>

            {/* Botón volver arriba */}
            <button
              onClick={scrollToTop}
              className="self-start flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 group"
            >
              <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              Volver arriba
            </button>
          </div>

          {/* ── Navegación ── */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500"></span>
              Navegación
            </h3>
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ label, icon: Icon, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="w-full flex items-center gap-3 text-zinc-400 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-zinc-800/60 transition-all group text-left"
                  >
                    <Icon size={15} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                    {label}
                    <ExternalLink size={11} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contacto ── */}
          <div className="md:col-span-5">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-blue-500"></span>
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">

              {empresa.email && (
                <li>
                  <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-4 py-3 group transition-all">
                    <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mb-0.5">Email</p>
                      <a
                        href={`mailto:${empresa.email}`}
                        className="text-sm text-zinc-300 hover:text-white font-medium truncate block transition-colors"
                      >
                        {empresa.email}
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(empresa.email, setCopiedEmail)}
                      title="Copiar email"
                      className="ml-2 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 transition-all shrink-0"
                    >
                      {copiedEmail ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </li>
              )}

              {empresa.telefono && (
                <li>
                  <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-4 py-3 group transition-all">
                    <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mb-0.5">Teléfono</p>
                      <a
                        href={`tel:${empresa.telefono}`}
                        className="text-sm text-zinc-300 hover:text-white font-medium truncate block transition-colors"
                      >
                        {empresa.telefono}
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(empresa.telefono, setCopiedPhone)}
                      title="Copiar teléfono"
                      className="ml-2 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-700 transition-all shrink-0"
                    >
                      {copiedPhone ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </li>
              )}

              {empresa.direccion && (
                <li>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(empresa.direccion)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-4 py-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mb-0.5">Dirección</p>
                      <p className="text-sm text-zinc-300 group-hover:text-white font-medium truncate transition-colors">
                        {empresa.direccion}
                      </p>
                    </div>
                    <ExternalLink size={13} className="text-zinc-600 group-hover:text-orange-400 transition-colors shrink-0 ml-2" />
                  </a>
                </li>
              )}

            </ul>
          </div>
        </div>

        {/* ── Barra inferior ── */}
        <div className="mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {año} <span className="text-zinc-500 font-semibold">{empresa.nombre}</span>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-zinc-600 font-medium">Sistema operativo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};