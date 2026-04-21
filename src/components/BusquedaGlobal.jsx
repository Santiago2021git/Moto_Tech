import React, { useState } from "react";
import {
  Search,
  Filter,
  Bike,
  Users,
  Calendar,
  Package,
  ChevronDown,
  X,
} from "lucide-react";

const allResults = [
  {
    id: 1,
    type: "vehiculo",
    title: "Yamaha MT-07 - ABC-123",
    sub: "Carlos Rodríguez",
    detail: "Último servicio: Cambio de aceite · 20 Feb 2025",
    icon: <Bike size={18} className="text-cyan-400" />,
    iconBg: "bg-cyan-500/20",
  },
  {
    id: 2,
    type: "cliente",
    title: "María Fernández",
    sub: "+57 315 987 6543",
    detail: "1 vehículo · Última visita: 18 Feb 2025",
    icon: <Users size={18} className="text-purple-400" />,
    iconBg: "bg-purple-500/20",
  },
  {
    id: 3,
    type: "cita",
    title: "Cita - Mantenimiento General",
    sub: "Juan Pérez · XYZ 789",
    detail: "Programada para: 28 Feb 2025, 10:00 AM",
    icon: <Calendar size={18} className="text-green-400" />,
    iconBg: "bg-green-500/20",
  },
  {
    id: 4,
    type: "repuesto",
    title: "Aceite Motul 10W40",
    sub: "Código: ACE 001",
    detail: "Stock: 24 unidades · Ubicación: Estante A 1",
    icon: <Package size={18} className="text-orange-400" />,
    iconBg: "bg-orange-500/20",
  },
  {
    id: 5,
    type: "vehiculo",
    title: "Honda CB500X - XYZ-789",
    sub: "Ana Martínez",
    detail: "Último servicio: Ajuste de frenos · 18 Feb 2025",
    icon: <Bike size={18} className="text-cyan-400" />,
    iconBg: "bg-cyan-500/20",
  },
  {
    id: 6,
    type: "cliente",
    title: "Diego López",
    sub: "+57 310 555 1234",
    detail: "2 vehículos · Última visita: 22 Feb 2025",
    icon: <Users size={18} className="text-purple-400" />,
    iconBg: "bg-purple-500/20",
  },
];

const typeBadge = {
  vehiculo: { label: "Vehículo", color: "bg-cyan-500/20 text-cyan-400" },
  cliente: { label: "Cliente", color: "bg-purple-500/20 text-purple-400" },
  cita: { label: "Cita", color: "bg-green-500/20 text-green-400" },
  repuesto: { label: "Repuesto", color: "bg-orange-500/20 text-orange-400" },
};

const tabs = [
  { key: "todos", label: "Todos" },
  { key: "vehiculo", label: "Vehículos" },
  { key: "cliente", label: "Clientes" },
  { key: "cita", label: "Citas" },
  { key: "repuesto", label: "Repuestos" },
];

export function BusquedaGlobal() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Más relevante");

  const filtered = allResults.filter((r) => {
    const matchTab = activeTab === "todos" || r.type === activeTab;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.sub.toLowerCase().includes(q) ||
      r.detail.toLowerCase().includes(q);
    return matchTab && matchQuery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Búsqueda Global</h1>
        <p className="text-gray-400 text-sm mt-1">
          Encuentra vehículos, clientes, citas y repuestos
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar por placa, nombre, código, fecha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-cyan-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">{filtered.length}</span>{" "}
          resultados encontrados
        </p>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300"
          >
            {sort}
            <ChevronDown size={14} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-7 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 min-w-[160px]">
              {["Más relevante", "Más reciente", "Alfabético"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSort(opt);
                    setSortOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white first:rounded-t-xl last:rounded-b-xl"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Search size={40} className="mx-auto mb-3 opacity-40" />
            <p>No se encontraron resultados</p>
          </div>
        ) : (
          filtered.map((r) => {
            const badge = typeBadge[r.type];
            return (
              <div
                key={r.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.iconBg}`}
                >
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {r.title}
                  </p>
                  <p className="text-xs text-cyan-400 mt-0.5">{r.sub}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.detail}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${badge.color}`}
                >
                  {badge.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
        <p className="text-sm font-semibold text-blue-400 mb-2">
          Consejos de búsqueda
        </p>
        <ul className="space-y-1">
          {[
            "Busca por placa para encontrar vehículos rápidamente",
            "Usa el nombre o teléfono para buscar clientes",
            "Busca por código para encontrar repuestos específicos",
            "Los filtros te ayudan a refinar los resultados",
          ].map((tip) => (
            <li key={tip} className="text-xs text-blue-300">
              • {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
