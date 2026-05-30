import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { setEmpresa } from "../config/empresa";

// Paleta de colores tailwind por taller (clases completas para que Tailwind las detecte)
const themeByColor = {
  cyan: {
    primaryText: "text-cyan-400",
    primaryBg: "bg-cyan-500",
    primaryBgSoft: "bg-cyan-500/20",
    primaryBgHover: "hover:bg-cyan-500/10",
    primaryHoverText: "hover:text-cyan-400",
    primaryBorder: "border-cyan-500/20",
    gradient: "from-cyan-500 to-blue-600",
    ring: "focus:ring-cyan-500",
  },
  orange: {
    primaryText: "text-orange-400",
    primaryBg: "bg-orange-500",
    primaryBgSoft: "bg-orange-500/20",
    primaryBgHover: "hover:bg-orange-500/10",
    primaryHoverText: "hover:text-orange-400",
    primaryBorder: "border-orange-500/20",
    gradient: "from-orange-500 to-red-600",
    ring: "focus:ring-orange-500",
  },
  purple: {
    primaryText: "text-purple-400",
    primaryBg: "bg-purple-500",
    primaryBgSoft: "bg-purple-500/20",
    primaryBgHover: "hover:bg-purple-500/10",
    primaryHoverText: "hover:text-purple-400",
    primaryBorder: "border-purple-500/20",
    gradient: "from-purple-500 to-pink-600",
    ring: "focus:ring-purple-500",
  },
};

export const getTheme = (color) => themeByColor[color] || themeByColor.cyan;

const AuthContext = createContext(null);
const SESSION_KEY = "mototech_session";

export function AuthProvider({ children }) {
  const { talleres, usuariosCliente } = useApp();

  // Restaura sesión persistida (si existe)
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Re-resuelve los datos del usuario/taller en vivo desde el AppContext (por si fueron editados)
  const resolved = useMemo(() => {
    if (!session) return null;
    if (session.role === "super") {
      const s = talleres.find(x => x.id === session.userId && x.isSuper);
      if (!s) return null;
      return { role: "super", user: s, tallerActivo: null, isSuper: true };
    }
    if (session.role === "taller") {
      const t = talleres.find(x => x.id === session.userId && !x.isSuper);
      if (!t) return null;
      return { role: "taller", user: t, tallerActivo: t };
    }
    if (session.role === "cliente") {
      const c = usuariosCliente.find(x => x.id === session.userId);
      if (!c) return null;
      const t = talleres.find(x => x.id === c.tallerId && !x.isSuper) || talleres.find(x => !x.isSuper);
      return { role: "cliente", user: c, tallerActivo: t };
    }
    return null;
  }, [session, talleres, usuariosCliente]);

  useEffect(() => {
    if (resolved?.tallerActivo) setEmpresa(resolved.tallerActivo);
  }, [resolved]);

  const persistSession = (s) => {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  };

  const loginTaller = useCallback((email, password) => {
    const t = talleres.find(
      x => (x.usuario?.toLowerCase() === email.toLowerCase() || x.email?.toLowerCase() === email.toLowerCase()) && x.password === password
    );
    if (!t) return { ok: false, error: "Credenciales inválidas" };
    // Detección automática del super-usuario MotoTech
    const role = t.isSuper ? "super" : "taller";
    const s = { role, userId: t.id };
    setSession(s);
    persistSession(s);
    return { ok: true, role };
  }, [talleres]);

  const loginCliente = useCallback((email, password) => {
    const c = usuariosCliente.find(
      x => x.email?.toLowerCase() === email.toLowerCase() && x.password === password
    );
    if (!c) return { ok: false, error: "Credenciales inválidas" };
    const s = { role: "cliente", userId: c.id };
    setSession(s);
    persistSession(s);
    return { ok: true };
  }, [usuariosCliente]);

  const logout = useCallback(() => {
    setSession(null);
    persistSession(null);
  }, []);

  const cambiarTallerActivo = useCallback((tallerId) => {
    const t = talleres.find(x => x.id === tallerId);
    if (!t || !session || session.role !== "taller") return;
    const s = { role: "taller", userId: t.id };
    setSession(s);
    persistSession(s);
  }, [talleres, session]);

  const value = useMemo(() => ({
    session: resolved,
    isAuthenticated: !!resolved,
    role: resolved?.role || null,
    user: resolved?.user || null,
    tallerActivo: resolved?.tallerActivo || null,
    isSuper: resolved?.role === "super",
    theme: getTheme(resolved?.tallerActivo?.color || resolved?.user?.color),
    loginTaller,
    loginCliente,
    logout,
    cambiarTallerActivo,
  }), [resolved, loginTaller, loginCliente, logout, cambiarTallerActivo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ role, children }) {
  const { isAuthenticated, role: currentRole } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role) {
    const allowed = Array.isArray(role) ? role.includes(currentRole) : role === currentRole;
    if (!allowed) {
      const fallback = currentRole === "cliente" ? "/cliente" : currentRole === "super" ? "/super" : "/";
      return <Navigate to={fallback} replace />;
    }
  }
  return children;
}
