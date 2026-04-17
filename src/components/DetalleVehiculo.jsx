import React, { useState } from 'react';
import { 
  ArrowLeft, Bike, Clock, DollarSign, Image as ImageIcon, 
  User, Phone, Mail, MapPin, Send, Wrench, Plus,
  FileText, Calendar, Edit3, Package, Camera, Trash2
} from 'lucide-react';

export const DetalleVehiculo = ({ vehiculo, onBack }) => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Servicio', 'Costos', 'Repuestos', 'Evidencias'];

  const stats = [
    { label: 'Tiempo de Espera', value: 'hace 10 días', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Costo Total', value: '$245.000', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Evidencias', value: '0 foto(s)', icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="animate-in space-y-6 pb-10">
      {/* NAVEGACIÓN */}
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm uppercase tracking-widest">Volver</span>
      </button>

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
            <Bike size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {vehiculo?.marca || "Honda"} {vehiculo?.modelo || "CBR 600RR"}
            </h2>
            <p className="text-zinc-500 font-medium">
              Placa: <span className="text-zinc-300">{vehiculo?.placa || "ABC123"}</span> • <span className="text-zinc-300">{vehiculo?.año || "2022"}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-bold">
            <Wrench size={16} /> {vehiculo?.estado || "En Proceso"}
          </div>
          <button className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Actualizar Estado
          </button>
        </div>
      </div>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS SELECTOR */}
      <div className="bg-zinc-950/50 p-1.5 rounded-2xl border border-zinc-800 inline-flex flex-wrap w-full lg:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab} onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 lg:flex-none ${
              activeTab === tab ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENIDO DE PESTAÑAS */}
      <div className="mt-6">
        
        {/* PESTAÑA: GENERAL */}
        {activeTab === 'General' && (
          <div className="animate-in space-y-6">
            <section className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8 text-zinc-400">
                <FileText size={20} /> <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Ficha Técnica</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
                <InfoBlock label="Marca" value={vehiculo?.marca || "Honda"} />
                <InfoBlock label="Modelo" value={vehiculo?.modelo || "CBR 600RR"} />
                <InfoBlock label="Placa" value={vehiculo?.placa || "ABC123"} />
                <InfoBlock label="Año" value={vehiculo?.año || "2022"} />
                <InfoBlock label="Color" value="Rojo" />
                <InfoBlock label="Ingreso" value="20 feb 2026 - 09:00" />
              </div>
            </section>
            {/* ... Sección de Propietario omitida para brevedad pero sigue la misma lógica ... */}
          </div>
        )}

        {/* PESTAÑA: SERVICIO */}
        {activeTab === 'Servicio' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-10 text-zinc-400">
              <Wrench size={22} className="text-blue-500" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Registro de Procedimiento</h3>
            </div>
            <div className="space-y-10">
              <ServiceBlock label="Descripción del Servicio" value="Cambio de aceite y filtros" />
              <ServiceBlock label="Diagnóstico" value="Mantenimiento preventivo de rutina. Desgaste normal." isMuted />
              <ServiceBlock label="Notas del Mecánico" value="Cliente solicita revisión general del motor." isMuted />
            </div>
          </section>
        )}

        {/* PESTAÑA: COSTOS */}
        {activeTab === 'Costos' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-zinc-400">
                <DollarSign size={22} className="text-green-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Gestión de Costos</h3>
              </div>
              <button className="bg-white text-black px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2"><Plus size={18}/> Agregar Costo</button>
            </div>
            <div className="space-y-4">
              <CostItem label="Mano de obra" category="Labor" amount="$50.000" />
              <CostItem label="Aceite sintético 10W-40" category="Parts" amount="$85.000" />
              <div className="mt-8 bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex justify-between items-center">
                <span className="text-xl font-black text-white uppercase">Total</span>
                <span className="text-3xl font-black text-green-500">$135.000</span>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA: REPUESTOS (SEGÚN REFERENCIA) */}
        {activeTab === 'Repuestos' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-zinc-400">
                <Package size={22} className="text-blue-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Repuestos Utilizados</h3>
              </div>
              <button className="bg-white text-black px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2"><Plus size={18}/> Agregar Repuesto</button>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900">
                    <th className="pb-4">Repuesto</th>
                    <th className="pb-4 text-center">Cantidad</th>
                    <th className="pb-4 text-right">Precio Unit.</th>
                    <th className="pb-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 divide-y divide-zinc-900">
                  <TableRow label="Aceite sintético 10W-40" qty="1" price="$85.000" total="$85.000" />
                  <TableRow label="Filtro de aceite" qty="1" price="$25.000" total="$25.000" />
                </tbody>
              </table>
              <div className="mt-6 bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex justify-between items-center">
                <span className="text-xl font-black text-white uppercase">Total Repuestos</span>
                <span className="text-3xl font-black text-green-500">$110.000</span>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA: EVIDENCIAS (SEGÚN REFERENCIA) */}
        {activeTab === 'Evidencias' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-zinc-400">
                <Camera size={22} className="text-purple-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Evidencia Fotográfica</h3>
              </div>
              <button className="bg-white text-black px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2"><Plus size={18}/> Agregar Foto</button>
            </div>
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[2rem] text-zinc-600">
              <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">No hay evidencias fotográficas</p>
              <p className="text-sm">Las fotos del servicio aparecerán aquí.</p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
    <p className="text-zinc-200 font-bold text-lg">{value}</p>
  </div>
);

const ServiceBlock = ({ label, value, isMuted }) => (
  <div className="space-y-2 pb-6 border-b border-zinc-900/50">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
    <p className={`font-bold ${isMuted ? 'text-zinc-400 text-base font-medium' : 'text-white text-xl'}`}>{value}</p>
  </div>
);

const CostItem = ({ label, category, amount }) => (
  <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
    <div>
      <h4 className="text-white font-bold text-lg">{label}</h4>
      <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">{category}</p>
    </div>
    <span className="text-green-500 font-black text-xl">{amount}</span>
  </div>
);

const TableRow = ({ label, qty, price, total }) => (
  <tr className="group hover:bg-zinc-900/30 transition-colors">
    <td className="py-5 font-bold text-white">{label}</td>
    <td className="py-5 text-center font-medium">{qty}</td>
    <td className="py-5 text-right font-medium">{price}</td>
    <td className="py-5 text-right font-black text-green-500">{total}</td>
  </tr>
);