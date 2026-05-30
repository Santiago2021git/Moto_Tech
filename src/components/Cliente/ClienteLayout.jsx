import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bike, LayoutDashboard, MapPin, LogOut, Phone, Mail, Bell, X, Check } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useApp } from "../../context/AppContext";

export function ClienteLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tallerActivo, logout } = useAuth();
  const { notificaciones, marcarNotificacionLeida, marcarTodasLeidas, eliminarNotificacion } = useApp();
  const [showNotif, setShowNotif] = useState(false);

  const misNotif = notificaciones.filter(n => n.clienteUsuarioId === user?.id);
  const noLeidas = misNotif.filter(n => !n.leida).length;

  const items = [
    { name: "Mis motos", path: "/cliente", icon: <Bike size={18} /> },
    { name: "Mi taller", path: "/cliente/mi-taller", icon: <MapPin size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (p) =>
    p === "/cliente" ? location.pathname === "/cliente" : location.pathname.startsWith(p);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900/80 backdrop-blur border-r border-gray-800 p-5">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
              {user?.iniciales || "C"}
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">{user?.nombre}</h1>
              <p className="text-[11px] text-gray-500">Portal del cliente</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((it) => {
            const active = isActive(it.path);
            return (
              <button
                key={it.path}
                onClick={() => navigate(it.path)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all ${
                  active
                    ? "bg-purple-500/20 text-purple-400"
                    : "hover:bg-purple-500/10 hover:text-purple-400 text-gray-300"
                }`}
              >
                {it.icon}
                {it.name}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {tallerActivo && (
          <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3 mb-3 text-xs">
            <p className="text-gray-500 mb-1">Tu moto está en</p>
            <p className="text-white font-semibold">{tallerActivo.nombre}</p>
            <div className="flex items-center gap-1.5 text-gray-400 mt-1">
              <Phone size={11} /> {tallerActivo.telefono}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-2 py-1.5"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex justify-between items-center bg-gray-900/70 border-b border-gray-800 px-4 md:px-6 py-4 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img src="/Logo_MotoTech.jpeg" alt="MotoTech" className="w-9 h-9 rounded-full" />
            <div className="leading-tight">
              <p className="text-base font-black text-white">MotoTech</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Tu moto, en las mejores manos</p>
            </div>
          </div>

          <nav className="md:hidden flex gap-1 ml-auto">
            {items.map((it) => (
              <Link
                key={it.path}
                to={it.path}
                className={`p-2 rounded-lg ${
                  isActive(it.path) ? "bg-purple-500/20 text-purple-400" : "text-gray-400"
                }`}
              >
                {it.icon}
              </Link>
            ))}
            <button onClick={() => setShowNotif(true)} className="relative p-2 rounded-lg text-gray-400">
              <Bell size={18}/>
              {noLeidas > 0 && <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{noLeidas}</span>}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4 ml-auto text-sm text-gray-400">
            {tallerActivo && (
              <span className="hidden lg:flex items-center gap-1.5">
                <Mail size={14} /> {tallerActivo.email}
              </span>
            )}
            <button onClick={() => setShowNotif(true)} className="relative p-2 rounded-lg hover:bg-gray-800 text-gray-300">
              <Bell size={18} />
              {noLeidas > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{noLeidas}</span>
              )}
            </button>
            <span className="text-gray-600">·</span>
            <span className="text-white">{user?.nombre}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">{children}</main>
      </div>

      {showNotif && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={() => setShowNotif(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
          <aside onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm h-full bg-gray-950 border-l border-gray-800 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white flex items-center gap-2"><Bell size={18} className="text-purple-400"/> Notificaciones</h3>
              <div className="flex items-center gap-2">
                {noLeidas > 0 && (
                  <button onClick={() => marcarTodasLeidas({ clienteUsuarioId: user.id })} className="text-xs text-purple-400 hover:text-purple-300 font-bold">Marcar todas</button>
                )}
                <button onClick={() => setShowNotif(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
            </div>
            {misNotif.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-30"/>
                <p className="text-sm">No tienes notificaciones todavía.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {misNotif.slice().reverse().map(n => (
                  <li key={n.id} className={`p-3 rounded-xl border ${n.leida ? "bg-gray-900/40 border-gray-800" : "bg-purple-500/10 border-purple-500/30"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-white">{n.titulo}</p>
                      <button onClick={() => eliminarNotificacion(n.id)} className="text-gray-500 hover:text-red-400"><X size={14}/></button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{n.mensaje}</p>
                    {!n.leida && (
                      <button onClick={() => marcarNotificacionLeida(n.id)} className="text-[11px] text-purple-300 hover:text-purple-200 mt-2 flex items-center gap-1">
                        <Check size={11}/> Marcar como leída
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
