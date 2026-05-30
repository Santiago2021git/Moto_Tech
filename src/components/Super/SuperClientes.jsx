import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Search, Mail, Phone, MapPin, Bike, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ReadOnlyTag } from "./SuperLayout";

export const SuperClientes = () => {
  const { usuariosCliente, talleres, vehiculos } = useApp();
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const tallerNombre = (id) => talleres.find(t => t.id === id)?.nombre || "—";

  const filtrados = usuariosCliente.filter(c => {
    const t = busqueda.toLowerCase();
    return c.nombre.toLowerCase().includes(t) ||
           c.email.toLowerCase().includes(t) ||
           (c.telefono || "").includes(t);
  });

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Clientes</h1>
          <p className="text-zinc-500 mt-1 font-medium">Todos los clientes registrados en la plataforma.</p>
        </div>
        <ReadOnlyTag />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20}/>
        <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, correo o teléfono..."
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/40 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map(c => {
          const motos = vehiculos.filter(v => v.clienteUsuarioId === c.id).length;
          return (
            <button key={c.id} onClick={() => setSeleccionado(c)} className="text-left bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 rounded-3xl p-6 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-black">{c.iniciales}</div>
                <div>
                  <p className="font-bold text-white">{c.nombre}</p>
                  <p className="text-xs text-zinc-500">{tallerNombre(c.tallerId)}</p>
                </div>
              </div>
              <div className="text-xs text-zinc-400 space-y-1">
                <p className="flex items-center gap-1.5"><Mail size={12}/> {c.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={12}/> {c.telefono || "—"}</p>
                <p className="flex items-center gap-1.5"><Bike size={12}/> {motos} {motos === 1 ? "moto" : "motos"}</p>
              </div>
            </button>
          );
        })}
        {filtrados.length === 0 && <p className="text-zinc-500 col-span-full">No se encontraron clientes.</p>}
      </div>

      {seleccionado && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-zinc-950/95 p-4 overflow-y-auto" onClick={() => setSeleccionado(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg my-4 mx-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-black text-xl">{seleccionado.iniciales}</div>
                <div>
                  <h3 className="text-2xl font-black text-white">{seleccionado.nombre}</h3>
                  <ReadOnlyTag />
                </div>
              </div>
              <button onClick={() => setSeleccionado(null)} className="text-zinc-500 hover:text-white"><X size={22}/></button>
            </div>
            <div className="space-y-3 text-sm">
              <Row icon={Mail}    label="Email"     value={seleccionado.email}/>
              <Row icon={Phone}   label="Teléfono"  value={seleccionado.telefono}/>
              <Row icon={MapPin}  label="Dirección" value={seleccionado.direccion}/>
              <Row label="Documento" value={seleccionado.documento}/>
              <Row label="Taller asociado" value={tallerNombre(seleccionado.tallerId)}/>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Motos registradas</p>
              <div className="space-y-2">
                {vehiculos.filter(v => v.clienteUsuarioId === seleccionado.id).map(v => (
                  <div key={v.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
                    <Bike size={18} className="text-cyan-400"/>
                    <div>
                      <p className="text-white font-bold text-sm">{v.marca} {v.modelo}</p>
                      <p className="text-xs text-zinc-500">{v.placa} • {v.estado}</p>
                    </div>
                  </div>
                ))}
                {vehiculos.filter(v => v.clienteUsuarioId === seleccionado.id).length === 0 && (
                  <p className="text-zinc-500 text-sm">Sin motos registradas.</p>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-900">
    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon size={13}/>} {label}
    </span>
    <span className="text-zinc-200 font-medium text-right">{value || "—"}</span>
  </div>
);
