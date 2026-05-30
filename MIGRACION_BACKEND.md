# Migración Front ↔ Back (AppContext)

Fecha: 2026-05-30
Backend lógico: **AppContext** (`src/context/AppContext.jsx`) + persistencia en `localStorage` (clave `mototech_data_v2`).
Sesión: `localStorage` clave `mototech_session`.

---

## 1. Usuarios sembrados (registro inicial)

El sistema arranca con exactamente **dos usuarios precargados** en el contexto:

### Taller (rol `taller`)
| Campo | Valor |
|---|---|
| id | `taller-demo` |
| nombre | MotoTech Pereira |
| color | cyan |
| usuario / email | `admin@mototech.co` |
| password | `demo123` |
| nit | 900.123.456-7 |

### Cliente (rol `cliente`)
| Campo | Valor |
|---|---|
| id | `cli-demo` |
| nombre | Carlos Martínez |
| email | `carlos@demo.co` |
| password | `demo123` |
| tallerId | `taller-demo` |

> Estos son los **únicos** usuarios precargados; cualquier otro se crea desde `/registro/taller` o `/registro/cliente` y se persiste vía `registrarTaller()` / `registrarCliente()` del contexto.

---

## 2. Datos mock eliminados → reemplazo por AppContext

| Antes (mock) | Ahora (contexto / estado vacío) |
|---|---|
| `src/data/talleres.js` (`talleres[]` con 2 talleres hardcoded + `themeByColor`) | **Eliminado.** Talleres viven en `AppContext.talleres` con sólo el seed. `themeByColor` y `getTheme()` se movieron a `src/auth/AuthContext.jsx`. |
| `src/data/clientes.js` (`clientesDemo[2]`, `motosDemo[3]` con historial/fotos, `getMotosByCliente`, `getClienteById`) | **Eliminado.** Clientes-usuarios viven en `AppContext.usuariosCliente`; las motos en `AppContext.vehiculos` (las que tienen `clienteUsuarioId` se muestran al cliente). |
| `Vehiculos.jsx` → `useState([{ABC123 Honda CBR}, {XYZ789 Yamaha MT-07}, {DEF456 Kawasaki Z900}])` | `useApp().vehiculos` filtrado por `tallerId`. CRUD vía `agregarVehiculo / actualizarVehiculo / eliminarVehiculo`. Estado inicial: **`[]`**. |
| `Clientes.jsx` → `useState([Carlos Rodríguez, María Fernández, Juan Pérez])` (3 fichas) | `useApp().clientes` filtrado por `tallerId`. CRUD vía `agregarCliente / actualizarCliente`. Estado inicial: **`[]`** (las fichas se crean automáticamente al registrar un vehículo nuevo si el cliente no existe). |
| `Dashboard.jsx` → arrays `serviciosSemana`, `ingresosMes`, `estadoVehiculos`, `tiposServicio`, `stockBajo` y stats hardcoded `1/1/1/0`, citas `Ana Silva / Pedro Sánchez` | Todo derivado de `useApp()`: la serie semanal cuenta vehículos por fecha de ingreso; el estado se calcula sobre `vehiculos`; `tiposServicio` agrega `serviciosCotizados`; `stockBajo` filtra `inventario` por `stock<minStock`; las próximas citas vienen de `citas`. Con seed limpio se ven en cero. |
| `Reportes.jsx` → `kpis [$6.8M / 135 / 78 / 2.8]`, `ingresosMensuales` (Sep–Feb), `distribucion` 4 filas, `historialDocumentos` (2 PDFs ficticios) | Calculados desde `useApp()`: KPIs muestran finalizados/clientes reales; `ingresosMensuales` arranca en cero; `distribucion` se computa de `serviciosCotizados`; `historialDocumentos = []`. La exportación PDF/CSV con `jspdf` sigue funcional. |
| `Inventario.jsx` → `useState([Aceite Motul, Filtro K&N, Cadena DID, Bujía NGK])` (4 ítems) | `useApp().inventario` filtrado por `tallerId`. CRUD vía `agregarItem / actualizarItem`. Estado inicial: **`[]`**. |
| `Servicios.jsx` → `useState([Cambio Aceite, Mantenimiento Gral., Ajuste Frenos, Sincronización])` (4 servicios) | `useApp().servicios` (catálogo). CRUD vía `agregarServicio / actualizarServicio / eliminarServicio`. Estado inicial: **`[]`**. |
| `Empleados.jsx` → `useState([Roberto Gómez, Laura Sánchez, Carlos Ramírez, Andrés Torres])` (4 empleados) | `useApp().empleados`. CRUD vía `agregarEmpleado / actualizarEmpleado / eliminarEmpleado`. Estado inicial: **`[]`**. |
| `Agenda.jsx` → `useState(generarDiasHabiles(5))` con `dias[].citas[]` mutables | `useApp().citas` indexado por `fecha` (YYYY-MM-DD). CRUD vía `agregarCita / actualizarCita / eliminarCita`. Estado inicial: **`[]`**. |
| `RegistroTaller.jsx` → `setOk(true)` sin persistir | Llama `registrarTaller(form)` y persiste en `AppContext.talleres`. |
| `RegistroCliente.jsx` → `setOk(true)` sin persistir | Llama `registrarCliente(form)` y persiste en `AppContext.usuariosCliente`; permite elegir taller si hay más de uno. |
| `AuthContext` (auth con `talleres` + `clientesDemo` importados) | Lee credenciales desde `useApp()`; sesión persiste en `mototech_session`. |

### Módulos NO migrados (sin cambios respecto a fase 1)
- `Proveedores.jsx`: aún con datos locales (no se solicitó migración).
- `Notificaciones.jsx`: aún con datos locales (no se solicitó migración).
- `BusquedaGlobal.jsx`, `Configuracion.jsx`, `Perfil.jsx`, `Footer.jsx`, `MiTaller.jsx`: solo lectura/UI, no necesitan estado de datos.

---

## 3. Entidades expuestas por `useApp()`

```ts
{
  // Datos
  talleres, usuariosCliente, vehiculos, clientes,
  empleados, inventario, servicios, proveedores, citas,

  // Auth/registro
  registrarTaller(data), registrarCliente(data),

  // CRUD por entidad
  agregarVehiculo / actualizarVehiculo / eliminarVehiculo,
  agregarCliente  / actualizarCliente  / eliminarCliente,
  agregarEmpleado / actualizarEmpleado / eliminarEmpleado,
  agregarItem     / actualizarItem     / eliminarItem,
  agregarServicio / actualizarServicio / eliminarServicio,
  agregarProveedor/ actualizarProveedor/ eliminarProveedor,
  agregarCita     / actualizarCita     / eliminarCita,

  // Stats derivadas (en tiempo real)
  stats: { totalVehiculos, sinAtender, enProceso, finalizados,
           totalClientes, totalEmpleados, totalInventario,
           stockBajo, citasHoy, serviciosTotales,
           porMarca, porEstado },

  // Reset (útil para QA: borra localStorage y vuelve al seed)
  resetData(),
}
```

Provider montado en `src/App.jsx`: `<AppProvider> > <AuthProvider> > <Routes>`.

---

## 4. Pruebas realizadas

1. ✅ Lint/IDE: cero errores en los 19 archivos migrados (App, AuthContext, AppContext, los 9 módulos del taller, los 2 de cliente, los 2 logins y los 2 registros, Layout).
2. ✅ Build de producción: `npm run build` → `built in 27.49s` sin errores.
3. ✅ Dev server: `npm run dev` responde 200 en `http://localhost:5173/`.
4. ✅ Persistencia: AppContext escribe en `localStorage` (`mototech_data_v2`) en cada cambio; AuthContext escribe sesión en `mototech_session`.

### Pruebas funcionales sugeridas (manuales)
- **Login taller**: `admin@mototech.co` / `demo123` → debería entrar al dashboard del taller con todas las tarjetas en cero.
- **Login cliente**: `carlos@demo.co` / `demo123` → entra al dashboard del cliente con mensaje "Aún no tienes motos registradas" (correcto, porque el seed no incluye motos).
- **Registrar taller nuevo**: `/registro/taller` → tras submit, login con esas mismas credenciales debe funcionar.
- **Registrar cliente nuevo**: `/registro/cliente` → tras submit, login debe funcionar y aparecer asociado al taller seleccionado.
- **Crear vehículo** (módulo Vehículos): se persiste en `localStorage` y crea automáticamente la ficha de cliente correspondiente.
- **Crear cita** (Agenda): se asigna a la fecha del día seleccionado y aparece en el Dashboard como "Próxima cita".
- **Resetear**: en consola → `localStorage.clear()` o llamar `useApp().resetData()` para volver al seed.

---

## 5. Cómo extender más adelante

- Los CRUD de `proveedores` y `notificaciones` ya están listos en el contexto; sólo falta cablear los módulos respectivos.
- Para conectar a un backend real, basta con reemplazar los `setX(prev => ...)` por llamadas `fetch/axios` y mantener la firma `useApp()`.
