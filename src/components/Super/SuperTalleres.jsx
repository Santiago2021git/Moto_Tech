import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Store, Phone, Mail, MapPin, Bike, Users, Wrench, Calendar, Package, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ReadOnlyTag } from "./SuperLayout";

export const SuperTalleres = () => {
  const { talleres, vehiculos, usuariosCliente, empleados, citas, inventario, clientes } = useApp();
  const lista = talleres.filter(t => !t.isSuper);
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Talleres</h1>
          <p className="text-zinc-500 mt-1 font-medium">Información de todos los talleres registrados.</p>
        </div>
        <ReadOnlyTag />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map(t => {
          const vehs = vehiculos.filter(v => v.tallerId === t.id).length;
          const clis = clientes.filter(c => c.tallerId === t.id).length;
          return (
            <button key={t.id} onClick={() => setSeleccionado(t)} className="text-left bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 rounded-3xl p-6 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black text-lg">{t.iniciales}</div>
                <div>
                  <p className="font-black text-white text-lg">{t.nombre}</p>
                  <p className="text-xs text-zinc-500">{t.ciudad || "—"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Bike size={12}/> {vehs} motos</span>
                <span className="flex items-center gap-1.5"><Users size={12}/> {clis} clientes</span>
                <span className="flex items-center gap-1.5"><Phone size={12}/> {t.telefono || "—"}</span>
                <span className="flex items-center gap-1.5"><Mail size={12}/> {t.email}</span>
              </div>
            </button>
          );
        })}
        {lista.length === 0 && <p className="text-zinc-500 col-span-full">Aún no hay talleres registrados.</p>}
      </div>

      {seleccionado && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-zinc-950/95 p-4 overflow-y-auto" onClick={() => setSeleccionado(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl my-4 mx-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black text-xl">{seleccionado.iniciales}</div>
                <div>
                  <h3 className="text-2xl font-black text-white">{seleccionado.nombre}</h3>
                  <ReadOnlyTag />
                </div>
              </div>
              <button onClick={() => setSeleccionado(null)} className="text-zinc-500 hover:text-white"><X size={22}/></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field icon={Mail}     label="Email"     value={seleccionado.email}/>
              <Field icon={Phone}    label="Teléfono"  value={seleccionado.telefono}/>
              <Field icon={MapPin}   label="Dirección" value={seleccionado.direccion}/>
              <Field icon={Store}    label="Ciudad"    value={seleccionado.ciudad || "—"}/>
            </div>

            {seleccionado.descripcion && (
              <p className="text-zinc-400 text-sm bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 mb-6">{seleccionado.descripcion}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <Stat icon={Bike}     label="Motos"     value={vehiculos.filter(v => v.tallerId === seleccionado.id).length}/>
              <Stat icon={Users}    label="Clientes"  value={clientes.filter(c => c.tallerId === seleccionado.id).length}/>
              <Stat icon={Wrench}   label="Empleados" value={empleados.filter(e => e.tallerId === seleccionado.id).length}/>
              <Stat icon={Calendar} label="Citas"     value={citas.filter(c => c.tallerId === seleccionado.id).length}/>
              <Stat icon={Package}  label="Inventario" value={inventario.filter(i => i.tallerId === seleccionado.id).length}/>
              <Stat icon={Users}    label="Cuentas cliente" value={usuariosCliente.filter(u => u.tallerId === seleccionado.id).length}/>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const Field = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-zinc-200 font-bold text-sm flex items-center gap-2"><Icon size={14} className="text-zinc-500"/> {value || "—"}</p>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
    <Icon size={16} className="text-cyan-400 mb-2"/>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</p>
  </div>
);
