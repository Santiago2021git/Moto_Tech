import React from "react";
import { Store, Users, Bike, Wrench, Calendar, Package } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ReadOnlyTag } from "./SuperLayout";

export const SuperDashboard = () => {
  const { talleres, usuariosCliente, vehiculos, citas, empleados, inventario } = useApp();
  const tallersReales = talleres.filter(t => !t.isSuper);

  const kpis = [
    { label: "Talleres registrados", value: tallersReales.length, icon: Store, color: "from-blue-600 to-indigo-600" },
    { label: "Clientes registrados",  value: usuariosCliente.length, icon: Users, color: "from-purple-600 to-pink-600" },
    { label: "Motos en sistema",     value: vehiculos.length, icon: Bike,   color: "from-emerald-500 to-teal-600" },
    { label: "Empleados",            value: empleados.length, icon: Wrench, color: "from-orange-500 to-red-600" },
    { label: "Items en inventario",  value: inventario.length, icon: Package, color: "from-cyan-500 to-blue-600" },
    { label: "Citas agendadas",      value: citas.length, icon: Calendar, color: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Panel MotoTech</h1>
          <p className="text-zinc-500 mt-1 font-medium">Resumen global del sistema (solo lectura).</p>
        </div>
        <ReadOnlyTag />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${color} mb-4 text-white`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="text-zinc-500 text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Talleres activos</h3>
        <div className="divide-y divide-zinc-900">
          {tallersReales.map(t => {
            const vehs = vehiculos.filter(v => v.tallerId === t.id).length;
            const clis = usuariosCliente.filter(c => c.tallerId === t.id).length;
            return (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">{t.iniciales}</div>
                  <div>
                    <p className="font-bold text-white">{t.nombre}</p>
                    <p className="text-xs text-zinc-500">{t.ciudad || ""} • {t.email}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  <p><span className="text-white font-bold">{vehs}</span> motos</p>
                  <p><span className="text-white font-bold">{clis}</span> clientes</p>
                </div>
              </div>
            );
          })}
          {tallersReales.length === 0 && <p className="text-zinc-500 text-sm py-4">No hay talleres registrados.</p>}
        </div>
      </div>
    </div>
  );
};
