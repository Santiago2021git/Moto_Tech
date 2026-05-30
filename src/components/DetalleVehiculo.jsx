import React, { useState } from 'react';
import { 
  ArrowLeft, Bike, Clock, DollarSign, Image as ImageIcon, 
  User, Phone, Mail, MapPin, Send, Wrench, Plus,
  FileText, Calendar, Edit3, Package, Camera, Trash2
} from 'lucide-react';

const ESTADOS_V = ["Sin Atender", "En Proceso", "Finalizada"];

// Helper para asignar estilos visuales dinámicos según el estado de la moto
const getEstadoEstilos = (estado) => {
  switch (estado) {
    case "Finalizada":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "En Proceso":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default: // Sin Atender
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

export const DetalleVehiculo = ({ vehiculo, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Servicio', 'Costos', 'Repuestos', 'Evidencias'];

  const handleActualizarEstado = () => {
    if (!onUpdate) return;
    const currentIdx = ESTADOS_V.indexOf(vehiculo?.estado || 'Sin Atender');
    const nextEstado = ESTADOS_V[(currentIdx + 1) % ESTADOS_V.length];
    const ahora = new Date().toLocaleString('es-CO', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    onUpdate({ ...vehiculo, estado: nextEstado, ultimoCambioEstado: ahora });
  };

  const estilosEstado = getEstadoEstilos(vehiculo?.estado || 'Sin Atender');

  const stats = [
    { label: 'Ingreso al Taller', value: vehiculo?.ingreso || 'Reciente', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Presupuesto Actual', value: vehiculo?.costoTotal || '$135.000', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Evidencias', value: `${vehiculo?.evidencias?.length || 0} foto(s)`, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-500 shadow-lg">
            <Bike size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {vehiculo?.marca || "Moto"} {vehiculo?.modelo || "Sin Modelo"}
            </h2>
            <p className="text-zinc-500 font-medium">
              Placa: <span className="text-zinc-300 uppercase font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-xs ml-1 mr-2">{vehiculo?.placa || "---"}</span> • <span className="text-zinc-300 ml-1">Modelo {vehiculo?.año || "—"}</span>
            </p>
          </div>
        </div>
        
        {/* Acciones de Estado Dinámicas */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className={`flex-1 md:flex-none flex items-center justify-center gap-2 border px-4 py-2 rounded-xl text-sm font-bold transition-all ${estilosEstado}`}>
            <Wrench size={16} /> {vehiculo?.estado || "Sin Atender"}
          </div>
          <button onClick={handleActualizarEstado} className="flex-1 md:flex-none bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2 rounded-xl text-sm font-black transition-all active:scale-95 shadow-md">
            Siguiente Estado
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
              <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
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
                <InfoBlock label="Marca" value={vehiculo?.marca || "—"} />
                <InfoBlock label="Modelo" value={vehiculo?.modelo || "—"} />
                <InfoBlock label="Placa" value={vehiculo?.placa || "—"} />
                <InfoBlock label="Año" value={vehiculo?.año || "—"} />
                <InfoBlock label="Color" value={vehiculo?.color || "No especificado"} />
                <InfoBlock label="Fecha Ingreso" value={vehiculo?.ingreso || '—'} />
                {vehiculo?.ultimoCambioEstado && <InfoBlock label="Última Actualización" value={vehiculo.ultimoCambioEstado} />}
              </div>
            </section>
            <section className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8 text-zinc-400">
                <User size={20} /> <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Propietario</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
                <InfoBlock label="Cliente" value={vehiculo?.cliente || '—'} />
                <InfoBlock label="Teléfono de Contacto" value={vehiculo?.telefono || '—'} />
              </div>
            </section>
          </div>
        )}

        {/* PESTAÑA: SERVICIO */}
        {activeTab === 'Servicio' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-10 text-zinc-400">
              <Wrench size={22} className="text-purple-500" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Registro de Procedimiento</h3>
            </div>
            <div className="space-y-10">
              <ServiceBlock label="Descripción del Servicio" value={vehiculo?.descripcion || "Mantenimiento general preventivo"} />
              <ServiceBlock label="Diagnóstico Inicial" value={vehiculo?.diagnostico || "Vehículo ingresa para revisión de rutina por kilometraje."} isMuted />
              <ServiceBlock label="Notas Generales del Mecánico" value={vehiculo?.notas || "No se registran observaciones adicionales."} isMuted />
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
              <button className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-colors"><Plus size={18}/> Agregar Costo</button>
            </div>
            <div className="space-y-4">
              <CostItem label="Mano de obra taller" category="Servicio técnico" amount="$50.000" />
              <CostItem label="Filtros y Aceite Sintético" category="Repuestos utilizados" amount="$85.000" />
              <div className="mt-8 bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex justify-between items-center">
                <span className="text-xl font-black text-white uppercase">Total Liquidado</span>
                <span className="text-3xl font-black text-green-500">{vehiculo?.costoTotal || "$135.000"}</span>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA: REPUESTOS */}
        {activeTab === 'Repuestos' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-zinc-400">
                <Package size={22} className="text-blue-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Repuestos Utilizados</h3>
              </div>
              <button className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-colors"><Plus size={18}/> Agregar Repuesto</button>
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
                  <TableRow label="Aceite sintético de alto desempeño" qty="1" price="$85.000" total="$85.000" />
                  <TableRow label="Filtro de aceite original" qty="1" price="$25.000" total="$25.000" />
                </tbody>
              </table>
              <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex justify-between items-center">
                <span className="text-xl font-black text-white uppercase">Subtotal Repuestos</span>
                <span className="text-3xl font-black text-blue-400">$110.000</span>
              </div>
            </div>
          </section>
        )}

        {/* PESTAÑA: EVIDENCIAS */}
        {activeTab === 'Evidencias' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-zinc-400">
                <Camera size={22} className="text-purple-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Evidencia Fotográfica</h3>
              </div>
              <button className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition-colors"><Plus size={18}/> Agregar Foto</button>
            </div>
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[2rem] text-zinc-600">
              <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20 text-purple-500" />
              <p className="font-bold text-lg text-zinc-400">No hay evidencias fotográficas</p>
              <p className="text-sm text-zinc-600 mt-0.5">Las capturas del estado de la moto aparecerán aquí.</p>
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
    <p className={`font-bold ${isMuted ? 'text-zinc-500 text-base font-normal leading-relaxed' : 'text-white text-xl'}`}>{value}</p>
  </div>
);

const CostItem = ({ label, category, amount }) => (
  <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
    <div>
      <h4 className="text-white font-bold text-lg">{label}</h4>
      <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-0.5">{category}</p>
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