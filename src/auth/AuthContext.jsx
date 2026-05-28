import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { talleres, getTheme } from "../data/talleres";
import { clientesDemo } from "../data/clientes";
import { setEmpresa } from "../config/empresa";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // session: { role: 'taller' | 'cliente', user: {...}, tallerActivo: {...} }
  const [session, setSession] = useState(null);

  const loginTaller = useCallback((email, password) => {
    const taller = talleres.find(
      (t) => t.usuario.toLowerCase() === email.toLowerCase() && t.password === password
    );
    if (!taller) return { ok: false, error: "Credenciales inválidas" };
    setSession({ role: "taller", user: taller, tallerActivo: taller });
    return { ok: true };
  }, []);

  const loginCliente = useCallback((email, password) => {
    const cliente = clientesDemo.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!cliente) return { ok: false, error: "Credenciales inválidas" };
    const taller = talleres.find((t) => t.id === cliente.tallerId) || talleres[0];
    setSession({ role: "cliente", user: cliente, tallerActivo: taller });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setSession(null), []);

  // Mantiene `empresa` (export por defecto) sincronizado con el taller activo,
  // para que componentes que importan `empresa` directamente vean los datos del taller.
  useEffect(() => {
    if (session?.tallerActivo) setEmpresa(session.tallerActivo);
  }, [session]);

  /**
   * Permite cambiar el taller activo en demo (para mostrar marca blanca al profesor).
   * Solo aplica si está logueado como taller.
   */
  const cambiarTallerActivo = useCallback((tallerId) => {
    const t = talleres.find((x) => x.id === tallerId);
    if (!t) return;
    setSession((prev) =>
      prev ? { ...prev, user: prev.role === "taller" ? t : prev.user, tallerActivo: t } : prev
    );
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session,
      role: session?.role || null,
      user: session?.user || null,
      tallerActivo: session?.tallerActivo || null,
      theme: getTheme(session?.tallerActivo?.color),
      loginTaller,
      loginCliente,
      logout,
      cambiarTallerActivo,
    }),
    [session, loginTaller, loginCliente, logout, cambiarTallerActivo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * Guard: solo permite paso si está autenticado y opcionalmente con un rol específico.
 */
export function RequireAuth({ role, children }) {
  const { isAuthenticated, role: currentRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && currentRole !== role) {
    // Redirige al espacio que sí le corresponde
    return <Navigate to={currentRole === "cliente" ? "/cliente" : "/"} replace />;
  }
  return children;
}
