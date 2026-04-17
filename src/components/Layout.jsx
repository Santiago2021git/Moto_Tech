import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import {
  Menu,
  X,
  LayoutDashboard,
  Bike,
  Calendar,
  Users,
  UserCog,
  FileText,
  Boxes,
  Truck,
  BarChart3,
  Wrench,
  Search,
  Bell,
  Settings
} from "lucide-react";

// --- COMPONENTES DEL NAVBAR ---

const NavbarSearch = () => (
  <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-gray-800">
    <Search size={20} />
  </button>
);

const NavbarNotifications = () => (
  <button className="relative p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-gray-800">
    <Bell size={20} />
    {/* Punto rojo de notificación */}
    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-gray-900 rounded-full"></span>
  </button>
);

const NavbarProfile = () => (
  <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:opacity-80 transition-opacity mx-1">
    MG
  </button>
);

const NavbarSettings = () => (
  <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-gray-800">
    <Settings size={20} />
  </button>
);

// --- LAYOUT PRINCIPAL ---

export function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Vehículos", path: "/vehiculos", icon: <Bike size={18} /> },
    { name: "Agenda", path: "/agenda", icon: <Calendar size={18} /> },
    { name: "Clientes", path: "/clientes", icon: <Users size={18} /> },
    { name: "Empleados", path: "/empleados", icon: <UserCog size={18} /> },
    { name: "Facturas", path: "/facturas", icon: <FileText size={18} /> },
    { name: "Inventario", path: "/inventario", icon: <Boxes size={18} /> },
    { name: "Proveedores", path: "/proveedores", icon: <Truck size={18} /> },
    { name: "Reportes", path: "/reportes", icon: <BarChart3 size={18} /> },
    { name: "Servicios", path: "/servicios", icon: <Wrench size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900/80 backdrop-blur border-r border-gray-800 p-5">
        <h1 className="text-2xl font-bold text-cyan-400 mb-8">
          MotoTech
        </h1>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all
                ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-cyan-500/10 hover:text-cyan-400"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />
        <p className="text-xs text-gray-500">© 2026 MotoTech</p>
      </aside>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          <aside className="relative w-64 bg-gray-900 p-5 z-50 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl text-cyan-400 font-bold">
                MotoTech
              </h1>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all
                    ${
                      active
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "hover:bg-cyan-500/10 hover:text-cyan-400 text-gray-300"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        
        {/* NAVBAR */}
        <header className="flex justify-between items-center bg-gray-900/70 border-b border-gray-800 px-4 md:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm">
          {/* Lado izquierdo del Header */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-cyan-400 hidden sm:block">
              Panel de Control
            </h2>
          </div>

          {/* Lado derecho del Header - Componentes Nuevos */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NavbarSearch />
            <NavbarNotifications />
            <NavbarProfile />
            <NavbarSettings />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}