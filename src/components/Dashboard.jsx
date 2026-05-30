import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  AlertCircle, Wrench, CheckCircle2, Calendar,
  User, Clock, ArrowRight, TrendingUp, Package, AlertTriangle
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";

const hoy = new Date();

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 shadow-xl text-xs">
      <p className="text-zinc-400 mb-1 font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const fmtCOP = (v) => "$" + (v / 1000000).toFixed(1) + "M";

// ── Componente principal ──────────────────────────────────────────────────

export const Dashboard = () => {
  const navigate = useNavigate();
  usePageTitle("Dashboard");
  const [rangoIngr, setRangoIngr] = useState("mes");

  const { vehiculos, inventario, citas } = useApp();
  const { tallerActivo } = useAuth();
  const tid = tallerActivo?.id;

  // Filtrar por taller
  const misVehiculos = useMemo(() => vehiculos.filter(v => v.tallerId === tid), [vehiculos, tid]);
  const misInventario = useMemo(() => inventario.filter(i => i.tallerId === tid), [inventario, tid]);
  const misCitas = useMemo(() => citas.filter(c => c.tallerId === tid), [citas, tid]);

  const semanaLabel = (offsetDias) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - offsetDias);
    return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
  };

  // Servicios por día (últimos 7 días basado en fechas de ingreso)
  const serviciosSemana = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const vehiculosDelDia = misVehiculos.filter(v => v.ingreso === key);
      return {
        dia: semanaLabel(6 - i),
        servicios: vehiculosDelDia.length,
        ingresos: vehiculosDelDia.reduce((acc, v) => acc + (Number(v.costoEstimado) || 0), 0),
      };
    });
  }, [misVehiculos]);

  // Ingresos últimos 7 meses
  const ingresosMes = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - (6 - i), 1);
      const mesStr = d.toLocaleDateString("es-CO", { month: "short" });
      const anio = d.getFullYear();
      const mes = d.getMonth();
      const total = misVehiculos
        .filter(v => {
          if (!v.ingreso) return false;
          const vi = new Date(v.ingreso);
          return vi.getFullYear() === anio && vi.getMonth() === mes;
        })
        .reduce((acc, v) => acc + (Number(v.costoEstimado) || 0), 0);
      return { mes: mesStr, valor: total };
    });
  }, [misVehiculos]);

  // Estado de vehículos
  const estadoVehiculos = useMemo(() => [
    { name: "Sin Atender", value: misVehiculos.filter(v => v.estado === "Sin Atender").length, color: "#f97316" },
    { name: "En Proceso",  value: misVehiculos.filter(v => v.estado === "En Proceso").length,  color: "#3b82f6" },
    { name: "Finalizados", value: misVehiculos.filter(v => v.estado === "Finalizada").length,  color: "#22c55e" },
  ], [misVehiculos]);

  // Tipos de servicio por frecuencia
  const tiposServicio = useMemo(() => {
    const colores = ["#06b6d4", "#8b5cf6", "#f97316", "#22c55e", "#6b7280"];
    const conteo = {};
    misVehiculos.forEach(v => {
      (v.serviciosCotizados || []).forEach(s => {
        const nombre = s.nombre || s;
        conteo[nombre] = (conteo[nombre] || 0) + 1;
      });
    });
    const total = Object.values(conteo).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, cnt], i) => ({
        name,
        value: Math.round((cnt / total) * 100),
        color: colores[i] || "#6b7280",
      }));
  }, [misVehiculos]);

  // Stock bajo
  const stockBajo = useMemo(
    () => misInventario.filter(i => Number(i.stock) < Number(i.minStock)),
    [misInventario]
  );

  // Próximas citas (hoy en adelante, máx 6)
  const proximasCitas = useMemo(() => {
    const hoyStr = hoy.toISOString().slice(0, 10);
    return misCitas
      .filter(c => c.fecha >= hoyStr)
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora || "").localeCompare(b.hora || ""))
      .slice(0, 6);
  }, [misCitas]);

  const totalServiciosSemana = serviciosSemana.reduce((s, d) => s + d.servicios, 0);
  const totalIngresosMes = ingresosMes[ingresosMes.length - 1]?.valor || 0;
  const citasHoy = misCitas.filter(c => c.fecha === hoy.toISOString().slice(0, 10)).length;

  const stats = [
    { label: "Sin Atender",  value: String(estadoVehiculos[0].value), sub: "Vehículos en espera",  icon: AlertCircle,  color: "text-orange-400", bg: "bg-orange-500/10", route: "/vehiculos" },
    { label: "En Proceso",   value: String(estadoVehiculos[1].value), sub: "Trabajos en curso",    icon: Wrench,       color: "text-blue-400",   bg: "bg-blue-500/10",   route: "/vehiculos" },
    { label: "Finalizados",  value: String(estadoVehiculos[2].value), sub: "Esta semana",          icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/10",  route: "/vehiculos" },
    { label: "Citas Hoy",    value: String(citasHoy), sub: "Programadas",          icon: Calendar,     color: "text-purple-400", bg: "bg-purple-500/10", route: "/agenda" },
    { label: "Ingresos Mes", value: fmtCOP(totalIngresosMes), sub: hoy.toLocaleDateString("es-CO", { month: "long", year: "numeric" }), icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", route: "/reportes" },
    { label: "Servicios",    value: String(totalServiciosSemana), sub: "Esta semana", icon: Wrench, color: "text-indigo-400", bg: "bg-indigo-500/10", route: "/vehiculos" },
  ];

  return (
    <div className="space-y-8 animate-in pb-10">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-black text-white tracking-tight">Dashboard</h2>
        <p className="text-zinc-500 text-lg mt-1 font-medium">
          {hoy.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => navigate(stat.route)}
            className="bg-zinc-950 border border-zinc-800 rounded-[1.5rem] p-5 hover:border-zinc-700 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`${stat.color} ${stat.bg} p-2 rounded-xl`}>
                <stat.icon size={20} strokeWidth={2} />
              </div>
              <ArrowRight size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* FILA DE GRÁFICOS SUPERIORES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* SERVICIOS POR DÍA (barras) */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-base font-black text-white mb-1">Servicios esta semana</h3>
          <p className="text-xs text-zinc-500 mb-5">Cantidad de servicios realizados por día</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviciosSemana} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
              <Bar dataKey="servicios" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Servicios" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ESTADO DE VEHÍCULOS (dona) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-base font-black text-white mb-1">Estado de Vehículos</h3>
          <p className="text-xs text-zinc-500 mb-4">Distribución en tiempo real</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={estadoVehiculos} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {estadoVehiculos.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {estadoVehiculos.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-zinc-400">{e.name}</span>
                </div>
                <span className="font-bold text-white">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILA INFERIOR: INGRESOS + POPULARES + STOCK */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* INGRESOS (línea) */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-black text-white">Ingresos</h3>
            <div className="flex gap-2">
              {["mes", "semana"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRangoIngr(r)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${rangoIngr === r ? "bg-cyan-500/20 text-cyan-400" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  {r === "mes" ? "Mensual" : "Semanal"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-500 mb-5">{rangoIngr === "mes" ? "Últimos 7 meses" : "Esta semana por día"}</p>
          <ResponsiveContainer width="100%" height={200}>
            {rangoIngr === "mes" ? (
              <LineChart data={ingresosMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtCOP} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={fmtCOP} />} />
                <Line type="monotone" dataKey="valor" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} activeDot={{ r: 6 }} name="Ingresos" />
              </LineChart>
            ) : (
              <LineChart data={serviciosSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="dia" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtCOP} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={fmtCOP} />} />
                <Line type="monotone" dataKey="ingresos" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 4 }} activeDot={{ r: 6 }} name="Ingresos" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {/* SERVICIOS POPULARES (pastel) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5">
            <h3 className="text-sm font-black text-white mb-1">Servicios populares</h3>
            <p className="text-xs text-zinc-500 mb-3">Por tipo este mes</p>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={tiposServicio} cx="50%" cy="50%" outerRadius={50} dataKey="value" paddingAngle={3}>
                  {tiposServicio.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={(v) => v + "%"} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-1">
              {tiposServicio.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-zinc-400 truncate max-w-[140px]">{s.name}</span>
                  </div>
                  <span className="font-bold text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* STOCK BAJO */}
          <div className="bg-zinc-950 border border-orange-500/20 rounded-[2rem] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-orange-400" />
              <h3 className="text-sm font-black text-white">Stock Bajo</h3>
            </div>
            {stockBajo.length === 0 ? (
              <p className="text-xs text-zinc-500">Todo el inventario está en niveles correctos.</p>
            ) : (
              <div className="space-y-2">
                {stockBajo.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => navigate("/inventario")}
                    className="flex items-center justify-between cursor-pointer hover:bg-zinc-900 rounded-xl p-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-orange-400 flex-shrink-0" />
                      <span className="text-xs text-zinc-300 font-medium">{item.nombre}</span>
                    </div>
                    <span className="text-xs font-bold text-orange-400">{item.stock}/{item.min}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRÓXIMAS CITAS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-purple-400 px-2">
          <Calendar size={22} strokeWidth={2.5} />
          <h3 className="text-xl font-bold text-white tracking-tight">Próximas Citas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proximasCitas.length === 0 ? (
            <p className="text-zinc-500 text-sm">No hay citas próximas.</p>
          ) : proximasCitas.map((cita, i) => (
            <div
              key={cita.id || i}
              onClick={() => navigate("/agenda")}
              className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5 flex items-center justify-between hover:bg-zinc-900 transition-all border-l-4 border-l-purple-600 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-500/20 flex-shrink-0">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{cita.cliente || cita.nombre || "Cliente"}</h4>
                  <p className="text-xs text-zinc-500 font-mono">{cita.placa || cita.vehiculo || "—"}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md mt-1 inline-block bg-purple-500/10 text-purple-300">
                    {cita.servicio || cita.tipo || "Servicio"}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-purple-400">{cita.fecha}</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                  <Clock size={11} />{cita.hora}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};