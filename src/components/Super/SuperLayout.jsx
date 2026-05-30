import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Shield, Store, Users, LogOut, Menu, Eye, ChevronRight,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const NAV = [
  { to: "/super",           icon: Shield, label: "Resumen" },
  { to: "/super/talleres",  icon: Store,  label: "Talleres" },
  { to: "/super/clientes",  icon: Users,  label: "Clientes" },
];

export const SuperLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-900 z-40 transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-lg">
            {user?.iniciales || "MT"}
          </div>
          <div>
            <p className="font-black text-white text-lg leading-none">MotoTech</p>
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-1">Super Admin</p>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} end={to === "/super"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-900">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-900 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setOpen(true)} className="text-zinc-400"><Menu size={22} /></button>
          <p className="font-bold">MotoTech Admin</p>
          <div className="w-6" />
        </header>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Helpers compartidos por las pantallas de super
export const SuperBadge = ({ children, color = "cyan" }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
    {children}
  </span>
);

export const ReadOnlyTag = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700">
    <Eye size={10} /> Solo lectura
  </span>
);

export const ChevronRow = () => <ChevronRight size={16} className="text-zinc-600" />;
