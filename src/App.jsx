import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppProvider } from "./context/AppContext";
import { AuthProvider, RequireAuth, useAuth } from "./auth/AuthContext";

// Pantallas de autenticación
import { SeleccionRol } from "./components/Login/SeleccionRol";
import { LoginTaller } from "./components/Login/LoginTaller";
import { LoginCliente } from "./components/Login/LoginCliente";
import { RegistroTaller } from "./components/Login/RegistroTaller";
import { RegistroCliente } from "./components/Login/RegistroCliente";

// Layout y pantallas del taller
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Vehiculos } from "./components/Vehiculos";
import { Agenda } from "./components/Agenda";
import { Clientes } from "./components/Clientes";
import { Empleados } from "./components/Empleados";
import { Inventario } from "./components/Inventario";
import { Proveedores } from "./components/Proveedores";
import { Reportes } from "./components/Reportes";
import { Servicios } from "./components/Servicios";
import { BusquedaGlobal } from "./components/BusquedaGlobal";
import { Perfil } from "./components/Perfil";
import { Notificaciones } from "./components/Notificaciones";
import { Configuracion } from "./components/Configuracion";

// Vista de cliente
import { ClienteLayout } from "./components/Cliente/ClienteLayout";
import { ClienteDashboard } from "./components/Cliente/ClienteDashboard";
import { ClienteDetalleMoto } from "./components/Cliente/ClienteDetalleMoto";
import { MiTaller } from "./components/Cliente/MiTaller";

// Super admin (MotoTech)
import { SuperLayout } from "./components/Super/SuperLayout";
import { SuperDashboard } from "./components/Super/SuperDashboard";
import { SuperTalleres } from "./components/Super/SuperTalleres";
import { SuperClientes } from "./components/Super/SuperClientes";

// Si el usuario ya está autenticado y llega a /login, lo enviamos a su área
function RedirectIfAuth({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    const to = role === "cliente" ? "/cliente" : role === "super" ? "/super" : "/";
    return <Navigate to={to} replace />;
  }
  return children;
}

// Rutas del taller envueltas en Layout
const TallerRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/empleados" element={<Empleados />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/busqueda" element={<BusquedaGlobal />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/notificaciones" element={<Notificaciones />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

// Rutas del cliente envueltas en ClienteLayout
const ClienteRoutes = () => (
  <ClienteLayout>
    <Routes>
      <Route path="/" element={<ClienteDashboard />} />
      <Route path="/moto/:id" element={<ClienteDetalleMoto />} />
      <Route path="/mi-taller" element={<MiTaller />} />
      <Route path="*" element={<Navigate to="/cliente" replace />} />
    </Routes>
  </ClienteLayout>
);

// Rutas del super-admin
const SuperRoutes = () => (
  <SuperLayout>
    <Routes>
      <Route path="/" element={<SuperDashboard />} />
      <Route path="/talleres" element={<SuperTalleres />} />
      <Route path="/clientes" element={<SuperClientes />} />
      <Route path="*" element={<Navigate to="/super" replace />} />
    </Routes>
  </SuperLayout>
);

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <Routes>
          {/* Auth */}
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <SeleccionRol />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/login/taller"
            element={
              <RedirectIfAuth>
                <LoginTaller />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/login/cliente"
            element={
              <RedirectIfAuth>
                <LoginCliente />
              </RedirectIfAuth>
            }
          />
          <Route path="/registro/taller" element={<RegistroTaller />} />
          <Route path="/registro/cliente" element={<RegistroCliente />} />

          {/* Área del cliente */}
          <Route
            path="/cliente/*"
            element={
              <RequireAuth role="cliente">
                <ClienteRoutes />
              </RequireAuth>
            }
          />

          {/* Área del super-admin */}
          <Route
            path="/super/*"
            element={
              <RequireAuth role="super">
                <SuperRoutes />
              </RequireAuth>
            }
          />

          {/* Área del taller (catch-all autenticada) */}
          <Route
            path="/*"
            element={
              <RequireAuth role="taller">
                <TallerRoutes />
              </RequireAuth>
            }
          />
          </Routes>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
