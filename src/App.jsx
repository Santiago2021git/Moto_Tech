import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ── CONTEXTOS Y SEGURIDAD (Carga Inmediata) ───────────────────────────────
import { AuthProvider, RequireAuth, useAuth } from "./auth/AuthContext";
import { AppProvider } from "./context/AppContext";

// ── LAYOUTS (Carga Inmediata para evitar parpadeos visuales) ──────────────
import { Layout } from "./components/Layout";
import { ClienteLayout } from "./components/Cliente/ClienteLayout";

// ── COMPONENTES AUXILIARES ────────────────────────────────────────────────
// Un loader elegante y global mientras cargan las pantallas pesadas
const PantallaCarga = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

function RedirectIfAuth({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={role === "cliente" ? "/cliente" : "/"} replace />;
  }
  return children;
}

// ── CARGA PEREZOSA (Code Splitting) ───────────────────────────────────────
// Solo cargan cuando el usuario entra a la ruta, ahorrando memoria y tiempo
const SeleccionRol = lazy(() => import("./components/Login/SeleccionRol").then(m => ({ default: m.SeleccionRol })));
const LoginTaller = lazy(() => import("./components/Login/LoginTaller").then(m => ({ default: m.LoginTaller })));
const LoginCliente = lazy(() => import("./components/Login/LoginCliente").then(m => ({ default: m.LoginCliente })));
const RegistroTaller = lazy(() => import("./components/Login/RegistroTaller").then(m => ({ default: m.RegistroTaller })));
const RegistroCliente = lazy(() => import("./components/Login/RegistroCliente").then(m => ({ default: m.RegistroCliente })));

// Vistas Taller
const Dashboard = lazy(() => import("./components/Dashboard").then(m => ({ default: m.Dashboard })));
const Vehiculos = lazy(() => import("./components/Vehiculos").then(m => ({ default: m.Vehiculos })));
const Agenda = lazy(() => import("./components/Agenda").then(m => ({ default: m.Agenda })));
const Clientes = lazy(() => import("./components/Clientes").then(m => ({ default: m.Clientes })));
const Empleados = lazy(() => import("./components/Empleados").then(m => ({ default: m.Empleados })));
const Inventario = lazy(() => import("./components/Inventario").then(m => ({ default: m.Inventario })));
const Proveedores = lazy(() => import("./components/Proveedores").then(m => ({ default: m.Proveedores })));
const Reportes = lazy(() => import("./components/Reportes").then(m => ({ default: m.Reportes })));
const Servicios = lazy(() => import("./components/Servicios").then(m => ({ default: m.Servicios })));
const BusquedaGlobal = lazy(() => import("./components/BusquedaGlobal").then(m => ({ default: m.BusquedaGlobal })));
const Perfil = lazy(() => import("./components/Perfil").then(m => ({ default: m.Perfil })));
const Notificaciones = lazy(() => import("./components/Notificaciones").then(m => ({ default: m.Notificaciones })));
const Configuracion = lazy(() => import("./components/Configuracion").then(m => ({ default: m.Configuracion })));

// Vistas Cliente
const ClienteDashboard = lazy(() => import("./components/Cliente/ClienteDashboard").then(m => ({ default: m.ClienteDashboard })));
const ClienteDetalleMoto = lazy(() => import("./components/Cliente/ClienteDetalleMoto").then(m => ({ default: m.ClienteDetalleMoto })));
const MiTaller = lazy(() => import("./components/Cliente/MiTaller").then(m => ({ default: m.MiTaller })));

// ──────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          {/* Suspense envuelve las rutas para manejar la carga asíncrona */}
          <Suspense fallback={<PantallaCarga />}>
            <Routes>
              
              {/* ── RUTAS PÚBLICAS (AUTH) ── */}
              <Route path="/login" element={<RedirectIfAuth><SeleccionRol /></RedirectIfAuth>} />
              <Route path="/login/taller" element={<RedirectIfAuth><LoginTaller /></RedirectIfAuth>} />
              <Route path="/login/cliente" element={<RedirectIfAuth><LoginCliente /></RedirectIfAuth>} />
              <Route path="/registro/taller" element={<RedirectIfAuth><RegistroTaller /></RedirectIfAuth>} />
              <Route path="/registro/cliente" element={<RedirectIfAuth><RegistroCliente /></RedirectIfAuth>} />

              {/* ── ÁREA DEL CLIENTE (ANIDADA Y PROTEGIDA) ── */}
              <Route 
                path="/cliente" 
                element={
                  <RequireAuth role="cliente">
                    <ClienteLayout><Outlet /></ClienteLayout>
                  </RequireAuth>
                }
              >
                <Route index element={<ClienteDashboard />} /> 
                <Route path="moto/:id" element={<ClienteDetalleMoto />} />
                <Route path="mi-taller" element={<MiTaller />} />
                <Route path="*" element={<Navigate to="/cliente" replace />} />
              </Route>

              {/* ── ÁREA DEL TALLER (ANIDADA Y PROTEGIDA) ── */}
              <Route 
                path="/" 
                element={
                  <RequireAuth role="taller">
                    <Layout><Outlet /></Layout>
                  </RequireAuth>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="vehiculos" element={<Vehiculos />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="empleados" element={<Empleados />} />
                <Route path="inventario" element={<Inventario />} />
                <Route path="proveedores" element={<Proveedores />} />
                <Route path="reportes" element={<Reportes />} />
                <Route path="servicios" element={<Servicios />} />
                <Route path="busqueda" element={<BusquedaGlobal />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="notificaciones" element={<Notificaciones />} />
                <Route path="configuracion" element={<Configuracion />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>

            </Routes>
          </Suspense>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}