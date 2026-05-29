import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { useAuth } from "../auth/AuthContext";
import { talleres } from "../data/talleres";
import {
  Menu,
  X,
  LayoutDashboard,
  Bike,
  Calendar,
  Users,
  UserCog,
  Boxes,
  Truck,
  BarChart3,
  Wrench,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react";

// --- Selector de taller (modo demo de marca blanca) ---
function TallerSelector({ tallerActivo, onChange, theme }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs bg-gray-800/70 hover:bg-gray-800 text-gray-300 border border-gray-700"
        title="Cambiar taller (demo)"
      >
        <span className="text-base leading-none">{tallerActivo?.logoEmoji || "🏍️"}</span>
        <span className="hidden sm:inline max-w-[120px] truncate">{tallerActivo?.nombre}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-60 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-40 overflow-hidden">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 px-3 pt-3">
              Cambiar taller (demo)
            </p>
            {talleres.map((t) => {
              const active = t.id === tallerActivo?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm hover:bg-gray-800 ${
                    active ? theme.primaryText : "text-gray-300"
                  }`}
                >
                  <span className="text-lg">{t.logoEmoji}</span>
                  <span className="flex-1 truncate">{t.nombre}</span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// --- LAYOUT PRINCIPAL ---
export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { tallerActivo, theme, cambiarTallerActivo, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Vehículos", path: "/vehiculos", icon: <Bike size={18} /> },
    { name: "Agenda", path: "/agenda", icon: <Calendar size={18} /> },
    { name: "Clientes", path: "/clientes", icon: <Users size={18} /> },
    { name: "Empleados", path: "/empleados", icon: <UserCog size={18} /> },
    { name: "Inventario", path: "/inventario", icon: <Boxes size={18} /> },
    { name: "Proveedores", path: "/proveedores", icon: <Truck size={18} /> },
    { name: "Reportes", path: "/reportes", icon: <BarChart3 size={18} /> },
    { name: "Servicios", path: "/servicios", icon: <Wrench size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderNav = (closeMobile) =>
    menuItems.map((item) => {
      const active = location.pathname === item.path;
      return (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path);
            if (closeMobile) setOpen(false);
          }}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all ${
            active
              ? `${theme.primaryBgSoft} ${theme.primaryText}`
              : `${theme.primaryBgHover} ${theme.primaryHoverText} text-gray-300`
          }`}
        >
          {item.icon}
          {item.name}
        </button>
      );
    });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900/80 backdrop-blur border-r border-gray-800 p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-xl shadow-md`}>
            <span>{tallerActivo?.logoEmoji || "🏍️"}</span>
          </div>
          <div className="min-w-0">
            <h1 className={`text-lg font-bold ${theme.primaryText} leading-tight truncate`}>
              {tallerActivo?.nombre}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{tallerActivo?.eslogan}</p>
          </div>
        </div>

        <nav className="space-y-2">{renderNav(false)}</nav>

        <div className="flex-1" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-2 py-1.5 mb-2"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
        <p className="text-xs text-gray-500">
          © {tallerActivo?.anioFundacion || new Date().getFullYear()} {tallerActivo?.nombre}
        </p>
      </aside>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-gray-900 p-5 z-50 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-xl ${theme.primaryText} font-bold`}>{tallerActivo?.nombre}</h1>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2 flex-1">{renderNav(true)}</nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-2 py-1.5 mt-4"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* NAVBAR */}
        <header className="flex justify-between items-center bg-gray-900/70 border-b border-gray-800 px-4 md:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              className={`md:hidden text-gray-400 ${theme.primaryHoverText} transition-colors`}
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
            <img src="/Logo_MotoTech.jpeg" alt="Logo MotoTech" className="w-10 h-10 rounded-full" />
            <h2 className={`text-lg font-semibold ${theme.primaryText} hidden sm:block`}>
              {tallerActivo?.nombre}
            </h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <TallerSelector
              tallerActivo={tallerActivo}
              onChange={cambiarTallerActivo}
              theme={theme}
            />
            <button
              onClick={() => navigate("/busqueda")}
              className={`p-2 text-gray-400 ${theme.primaryHoverText} transition-colors rounded-full hover:bg-gray-800`}
              title="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => navigate("/notificaciones")}
              className={`relative p-2 text-gray-400 ${theme.primaryHoverText} transition-colors rounded-full hover:bg-gray-800`}
              title="Notificaciones"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-gray-900 rounded-full" />
            </button>
            <button
              onClick={() => navigate("/perfil")}
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md hover:opacity-80 transition-opacity mx-1`}
              title="Perfil"
            >
              {tallerActivo?.iniciales || "MT"}
            </button>
            <button
              onClick={() => navigate("/configuracion")}
              className={`p-2 text-gray-400 ${theme.primaryHoverText} transition-colors rounded-full hover:bg-gray-800`}
              title="Configuración"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
