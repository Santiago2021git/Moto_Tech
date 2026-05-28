import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bike, LayoutDashboard, MapPin, LogOut, Phone, Mail } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export function ClienteLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tallerActivo, logout } = useAuth();

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
          <div className="md:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.iniciales}
            </div>
            <div>
              <p className="text-sm text-white font-medium leading-tight">{user?.nombre}</p>
              <p className="text-[10px] text-gray-500">{tallerActivo?.nombre}</p>
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
            <span className="text-gray-600">·</span>
            <span className="text-white">{user?.nombre}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
}
