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
import { useApp } from "../context/AppContext";

// ── Datos estáticos e Históricos ──────────────────────────────────────────

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

const tiposServicio = [
  { name: "Cambio de Aceite",     value: 35, color: "#06b6d4" },
  { name: "Mantenimiento Gral.", value: 25, color: "#8b5cf6" },
  { name: "Ajuste de Frenos",    value: 20, color: "#f97316" },
  { name: "Motor / Sincro.",     value: 12, color: "#22c55e" },
  { name: "Otros",               value: 8,  color: "#6b7280" },
];

const stockBajo = [
  { nombre: "Filtro de Aceite K&N", stock: 5, min: 8 },
  { nombre: "Cadena DID 520",       stock: 2, min: 5 },
];

const proximasCitas = [
  { name: "Ana Silva",     plate: "GHI789", task: "Revisión inicial",     fecha: "Hoy",    time: "09:00", tipo: "revision"   },
  { name: "Pedro Sánchez", plate: "JKL012", task: "Reparación de escape", fecha: "Mañana", time: "14:00", tipo: "reparacion" },
];

// Tooltip Minimalista Premium
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 shadow-2xl text-xs">
      <p className="text-zinc-500 mb-1.5 font-bold uppercase tracking-wider text-[10px]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-black text-sm">
          {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const fmtCOP = (v) => "$" + (v / 1000000).toFixed(1) + "M";

// ── Componente Principal ──────────────────────────────────────────────────

export const Dashboard = () => {
  const navigate = useNavigate();
  usePageTitle("Dashboard");
  const [rangoIngr, setRangoIngr] = useState("mes");

  // Datos globales reales
  const { stats } = useApp();

  const totalServiciosSemana = serviciosSemana.reduce((s, d) => s + d.servicios, 0);
  const totalIngresosMes = ingresosMes[ingresosMes.length - 1].valor;
  
  // Cálculo dinámico de citas para el día de hoy
  const citasHoyCount = proximasCitas.filter(cita => cita.fecha === "Hoy").length;

  const estadoVehiculos = [
    { name: "Sin Atender", value: stats.sinAtender, color: "#f97316" }, // Ámbar/Naranja
    { name: "En Proceso",  value: stats.enProceso,  color: "#3b82f6" }, // Azul
    { name: "Finalizados", value: stats.finalizados, color: "#22c55e" }, // Verde
  ];

  const statCards = [
    { label: "Sin Atender",  value: String(stats.sinAtender),  sub: "Motos en espera",      icon: AlertCircle,    color: "text-orange-400", bg: "bg-orange-500/10", route: "/vehiculos" },
    { label: "En Proceso",   value: String(stats.enProceso),   sub: "Trabajos en curso",    icon: Wrench,         color: "text-blue-400",   bg: "bg-blue-500/10",   route: "/vehiculos" },
    { label: "Finalizados",  value: String(stats.finalizados), sub: "Listas esta semana",   icon: CheckCircle2,   color: "text-green-400",  bg: "bg-green-500/10",  route: "/vehiculos" },
    { label: "Citas Hoy",    value: String(citasHoyCount),     sub: "Por recibir hoy",      icon: Calendar,       color: "text-purple-400", bg: "bg-purple-500/10", route: "/agenda" },
    { label: "Ingresos Mes", value: fmtCOP(totalIngresosMes),  sub: hoy.toLocaleDateString("es-CO", { month: "short", year: "numeric" }), icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", route: "/reportes" },
    { label: "Servicios",    value: String(totalServiciosSemana), sub: "Total 7 días",       icon: Wrench,         color: "text-indigo-400", bg: "bg-indigo-500/10", route: "/vehiculos" },
  ];

  return (
    <div className="space-y-8 animate-in pb-10">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-black text-white tracking-tight">Dashboard</h2>
        <p className="text-zinc-500 text-lg mt-1 font-medium capitalize">
          {hoy.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* TARJETAS MÉTRICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            onClick={() => navigate(stat.route)}
            className="bg-zinc-950 border border-zinc-800 rounded-[1.5rem] p-5 hover:border-zinc-700 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98] shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} ${stat.bg} p-2 rounded-xl`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <ArrowRight size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xs text-zinc-600 mt-0.5 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* FILA DE GRÁFICOS SUPERIORES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* GRÁFICO: SERVICIOS POR DÍA */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white mb-0.5">Servicios esta semana</h3>
            <p className="text-xs text-zinc-500 mb-5">Cantidad de ingresos operativos registrados por día</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviciosSemana} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "#52525b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.03)" }} />
              <Bar dataKey="servicios" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Servicios" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO: DISTRIBUCIÓN EN TIEMPO REAL */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-white mb-0.5">Estado de Vehículos</h3>
            <p className="text-xs text-zinc-500 mb-2">
              Distribución actual <span className="ml-1 text-zinc-600 font-bold">({stats.totalVehiculos} en total)</span>
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={estadoVehiculos}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={65}
                  paddingAngle={5} dataKey="value"
                >
                  {estadoVehiculos.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2 border-t border-zinc-900 pt-3">
            {estadoVehiculos.map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-zinc-400">{e.name}</span>
                </div>
                <span className="font-black text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/60 font-mono text-[11px]">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILA INFERIOR */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* MONITOR DE INGRESOS */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-base font-black text-white">Flujo de Ingresos</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{rangoIngr === "mes" ? "Rendimiento histórico de los últimos 7 meses" : "Ingresos diarios percibidos esta semana"}</p>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {["mes", "semana"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRangoIngr(r)}
                  className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all ${rangoIngr === r ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {r === "mes" ? "Mensual" : "Semanal"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={190}>
              {rangoIngr === "mes" ? (
                <LineChart data={ingresosMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: "#52525b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtCOP} tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip formatter={(v) => "$" + v.toLocaleString("es-CO")} />} />
                  <Line type="monotone" dataKey="valor" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Ingresos" />
                </LineChart>
              ) : (
                <LineChart data={serviciosSemana}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fill: "#52525b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "K"} tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip formatter={(v) => "$" + v.toLocaleString("es-CO")} />} />
                  <Line type="monotone" dataKey="ingresos" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Ingresos" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* CONTENEDOR DERECHO: SERVICIOS POPULARES Y STOCK */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* SERVICIOS POPULARES */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-white mb-0.5">Servicios más solicitados</h3>
              <p className="text-xs text-zinc-500 mb-2">Métricas de demanda este mes</p>
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={tiposServicio} cx="50%" cy="50%" outerRadius={40} dataKey="value" paddingAngle={4}>
                  {tiposServicio.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={(v) => v + "%"} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2 border-t border-zinc-900 pt-2.5">
              {tiposServicio.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-zinc-400 truncate max-w-[150px]">{s.name}</span>
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
              <h3 className="text-sm font-black text-white">Alertas de Inventario</h3>
            </div>
            {stockBajo.length === 0 ? (
              <p className="text-xs text-zinc-500 font-medium">Niveles de repuestos estables.</p>
            ) : (
              <div className="space-y-2">
                {stockBajo.map((item, i) => (
                  <div
                    key={i} onClick={() => navigate("/inventario")}
                    className="flex items-center justify-between cursor-pointer bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-xl p-2.5 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Package size={14} className="text-orange-400/80 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-zinc-300 font-bold truncate">{item.nombre}</span>
                    </div>
                    <span className="text-xs font-black text-orange-400 bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded font-mono flex-shrink-0">
                      {item.stock} / {item.min}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN: PRÓXIMAS CITAS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 text-purple-400 px-1">
          <Calendar size={20} strokeWidth={2.5} />
          <h3 className="text-xl font-bold text-white tracking-tight">Próximas Citas Programadas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proximasCitas.map((cita, i) => (
            <div
              key={i} onClick={() => navigate("/agenda")}
              className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-5 flex items-center justify-between hover:border-zinc-700 transition-all border-l-4 border-l-purple-500 cursor-pointer active:scale-[0.99] shadow-md group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-purple-400 border border-zinc-800 flex-shrink-0">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-black text-white truncate">{cita.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono font-black uppercase bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded">
                      {cita.plate}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${cita.tipo === "revision" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"}`}>
                      {cita.task}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-lg font-black text-purple-400 group-hover:text-purple-300 transition-colors">{cita.fecha}</p>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end mt-0.5">
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