import React, { useState } from "react";
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

// ── Datos de ejemplo ──────────────────────────────────────────────────────

const hoy = new Date();
const semanaLabel = (offsetDias) => {
  const d = new Date(hoy);
  d.setDate(hoy.getDate() - offsetDias);
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" });
};

const serviciosSemana = [
  { dia: semanaLabel(6), servicios: 3, ingresos: 420000 },
  { dia: semanaLabel(5), servicios: 5, ingresos: 680000 },
  { dia: semanaLabel(4), servicios: 2, ingresos: 310000 },
  { dia: semanaLabel(3), servicios: 6, ingresos: 870000 },
  { dia: semanaLabel(2), servicios: 4, ingresos: 550000 },
  { dia: semanaLabel(1), servicios: 7, ingresos: 940000 },
  { dia: semanaLabel(0), servicios: 3, ingresos: 420000 },
];

const ingresosMes = [
  { mes: "Nov", valor: 4800000 },
  { mes: "Dic", valor: 6100000 },
  { mes: "Ene", valor: 5500000 },
  { mes: "Feb", valor: 6800000 },
  { mes: "Mar", valor: 7200000 },
  { mes: "Abr", valor: 6500000 },
  { mes: "May", valor: 7900000 },
];

const estadoVehiculos = [
  { name: "Sin Atender", value: 1, color: "#f97316" },
  { name: "En Proceso",  value: 1, color: "#3b82f6" },
  { name: "Finalizados", value: 1, color: "#22c55e" },
];

const tiposServicio = [
  { name: "Cambio de Aceite",    value: 35, color: "#06b6d4" },
  { name: "Mantenimiento Gral.", value: 25, color: "#8b5cf6" },
  { name: "Ajuste de Frenos",    value: 20, color: "#f97316" },
  { name: "Motor / Sincro.",     value: 12, color: "#22c55e" },
  { name: "Otros",               value: 8,  color: "#6b7280" },
];

const stockBajo = [
  { nombre: "Filtro de Aceite K&N", stock: 5, min: 8 },
  { nombre: "Cadena DID 520",       stock: 2, min: 5 },
];

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

  const totalServiciosSemana = serviciosSemana.reduce((s, d) => s + d.servicios, 0);
  const totalIngresosMes = ingresosMes[ingresosMes.length - 1].valor;

  const stats = [
    { label: "Sin Atender",  value: "1", sub: "Vehículos en espera",  icon: AlertCircle,  color: "text-orange-400", bg: "bg-orange-500/10", route: "/vehiculos" },
    { label: "En Proceso",   value: "1", sub: "Trabajos en curso",    icon: Wrench,       color: "text-blue-400",   bg: "bg-blue-500/10",   route: "/vehiculos" },
    { label: "Finalizados",  value: "1", sub: "Esta semana",          icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/10",  route: "/vehiculos" },
    { label: "Citas Hoy",    value: "0", sub: "Programadas",          icon: Calendar,     color: "text-purple-400", bg: "bg-purple-500/10", route: "/agenda" },
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
          {[
            { name: "Ana Silva",     plate: "GHI789", task: "Revisión inicial",     fecha: "Hoy",    time: "09:00", tipo: "revision" },
            { name: "Pedro Sánchez", plate: "JKL012", task: "Reparación de escape", fecha: "Mañana", time: "14:00", tipo: "reparacion" },
          ].map((cita, i) => (
            <div
              key={i}
              onClick={() => navigate("/agenda")}
              className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5 flex items-center justify-between hover:bg-zinc-900 transition-all border-l-4 border-l-purple-600 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-500/20 flex-shrink-0">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{cita.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono">{cita.plate}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${cita.tipo === "revision" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                    {cita.task}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-purple-400">{cita.fecha}</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                  <Clock size={11} />{cita.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};