import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Vehiculos } from "./components/Vehiculos";
import { Agenda } from "./components/Agenda";
import { Clientes } from "./components/Clientes";
import { Empleados } from "./components/Empleados";
import { Facturas } from "./components/Facturas";
import { Inventario } from "./components/Inventario";
import { Proveedores } from "./components/Proveedores";
import { Reportes } from "./components/Reportes";
import { Servicios } from "./components/Servicios";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/servicios" element={<Servicios />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;