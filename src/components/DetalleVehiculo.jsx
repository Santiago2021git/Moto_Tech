import React, { useState, useRef, useMemo } from 'react';
import {
  ArrowLeft, Bike, Clock, DollarSign, Image as ImageIcon,
  User, Wrench, FileText, Camera, Trash2, X, Check,
  AlertCircle, Send, Package, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';

const ESTADOS_V = ["Sin Atender", "En Proceso", "Finalizada"];

const fmtCOP = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(n) || 0);
const parsePrecio = (p) => Number(String(p || 0).replace(/[^\d.-]/g, "")) || 0;

export const DetalleVehiculo = ({ vehiculo, onBack, onUpdate }) => {
  const { servicios, inventario, descontarStock, finalizarVehiculo } = useApp();
  const { tallerActivo } = useAuth();
  const [activeTab, setActiveTab] = useState('General');
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);
  const [showAddRepuesto, setShowAddRepuesto] = useState(false);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({ itemId: "", cantidad: 1 });

  // ── Reporte de entrega state ──
  const [showReporte, setShowReporte] = useState(false);
  const [reporte, setReporte] = useState({
    descripcion: "", recomendaciones: "", valorTotal: 0, fotos: [],
  });
  const [reporteErrors, setReporteErrors] = useState({});

  const serviciosCotizados = vehiculo?.serviciosCotizados || [];
  const totalServiciosCotizados = useMemo(
    () => serviciosCotizados.reduce((s, sc) => s + parsePrecio(sc.precio ?? sc.valor), 0),
    [serviciosCotizados]
  );
  const repuestos = vehiculo?.repuestos || [];
  const totalRepuestos = useMemo(
    () => repuestos.reduce((s, r) => s + parsePrecio(r.precio) * (Number(r.cantidad) || 1), 0),
    [repuestos]
  );
  const evidencias = vehiculo?.reporteEntrega?.fotos || [];
  const totalGeneral = totalServiciosCotizados + totalRepuestos;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const tabs = ['General', 'Servicio', 'Costos', 'Repuestos', 'Evidencias'];

  const handleActualizarEstado = () => {
    if (!onUpdate) return;
    const currentIdx = ESTADOS_V.indexOf(vehiculo?.estado || 'Sin Atender');
    const nextEstado = ESTADOS_V[(currentIdx + 1) % ESTADOS_V.length];
    if (nextEstado === "Finalizada") {
      // abrir modal de reporte
      setReporte({
        descripcion: "",
        recomendaciones: "",
        valorTotal: totalGeneral,
        fotos: [],
      });
      setReporteErrors({});
      setShowReporte(true);
      return;
    }
    const ahora = new Date().toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    onUpdate({ ...vehiculo, estado: nextEstado, ultimoCambioEstado: ahora });
  };

  const handleFotoReporte = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 1024 * 1024) { showToast("Cada foto debe pesar menos de 1MB."); return; }
      const reader = new FileReader();
      reader.onload = () => {
        setReporte(prev => ({ ...prev, fotos: [...prev.fotos, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removerFoto = (i) => {
    setReporte(prev => ({ ...prev, fotos: prev.fotos.filter((_, idx) => idx !== i) }));
  };

  const validarReporte = () => {
    const e = {};
    if (!reporte.descripcion.trim()) e.descripcion = "Describe el trabajo realizado.";
    if (!reporte.valorTotal || Number(reporte.valorTotal) <= 0) e.valorTotal = "Indica el valor del mantenimiento.";
    return e;
  };

  const handleEnviarReporte = () => {
    const e = validarReporte();
    if (Object.keys(e).length > 0) { setReporteErrors(e); return; }
    finalizarVehiculo(vehiculo.id, {
      descripcion: reporte.descripcion,
      recomendaciones: reporte.recomendaciones,
      valorTotal: Number(reporte.valorTotal),
      fotos: reporte.fotos,
      tecnico: vehiculo.tecnico || "Sin asignar",
      tallerId: tallerActivo?.id,
      tallerNombre: tallerActivo?.nombre,
      fecha: new Date().toISOString(),
    });
    setShowReporte(false);
    showToast("Servicio finalizado y notificación enviada al cliente.");
    // Reflejar en pantalla:
    if (onUpdate) {
      onUpdate({ ...vehiculo, estado: "Finalizada", avance: 100, reporteEntrega: { ...reporte, valorTotal: Number(reporte.valorTotal) } });
    }
  };

  const stats = [
    { label: 'Ingreso', value: vehiculo?.ingreso || '—', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Costo Total', value: fmtCOP(totalGeneral), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Evidencias', value: `${evidencias.length} foto${evidencias.length === 1 ? '' : 's'}`, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="animate-in space-y-6 pb-10">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-green-500/40 text-green-400 px-5 py-3 rounded-2xl shadow-xl">
          <Check size={18} /><span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* MODAL REPORTE DE ENTREGA */}
      {showReporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-2xl font-black text-white">Reporte de entrega</h3>
                <p className="text-zinc-500 text-sm mt-1">Se enviará una notificación al cliente con esta información.</p>
              </div>
              <button onClick={() => setShowReporte(false)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Descripción del trabajo realizado *</label>
                <textarea rows={4} value={reporte.descripcion} onChange={(e) => setReporte(p => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Detalla los servicios realizados, repuestos cambiados, hallazgos..."
                  className={`w-full bg-zinc-900 border ${reporteErrors.descripcion ? 'border-red-500/60' : 'border-zinc-800'} focus:border-green-500/60 rounded-xl py-2.5 px-4 text-white outline-none resize-none`} />
                {reporteErrors.descripcion && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{reporteErrors.descripcion}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Recomendaciones para el cliente</label>
                <textarea rows={3} value={reporte.recomendaciones} onChange={(e) => setReporte(p => ({ ...p, recomendaciones: e.target.value }))}
                  placeholder="Próximo mantenimiento, hábitos de uso, alertas..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-green-500/60 rounded-xl py-2.5 px-4 text-white outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Valor del mantenimiento *</label>
                  <input type="number" min="0" value={reporte.valorTotal}
                    onChange={(e) => setReporte(p => ({ ...p, valorTotal: e.target.value }))}
                    className={`w-full bg-zinc-900 border ${reporteErrors.valorTotal ? 'border-red-500/60' : 'border-zinc-800'} focus:border-green-500/60 rounded-xl py-2.5 px-4 text-white outline-none`} />
                  <p className="text-xs text-zinc-500 mt-1">{fmtCOP(reporte.valorTotal)}</p>
                  {reporteErrors.valorTotal && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{reporteErrors.valorTotal}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Sugerencia (auto)</label>
                  <button type="button"
                    onClick={() => setReporte(p => ({ ...p, valorTotal: totalGeneral }))}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">
                    Usar total cotizado: {fmtCOP(totalGeneral)}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Fotos del servicio</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {reporte.fotos.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-800">
                      <img src={src} alt={`evidencia-${i}`} className="w-full h-full object-cover" />
                      <button onClick={() => removerFoto(i)} className="absolute top-1 right-1 bg-black/70 text-red-400 rounded-md p-1 hover:bg-black"><X size={12}/></button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-800 hover:border-green-500/40 text-zinc-500 hover:text-green-400 flex flex-col items-center justify-center transition-colors">
                    <Camera size={20}/><span className="text-[10px] mt-1 font-bold">Añadir</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFotoReporte} className="hidden" />
                </div>
                <p className="text-xs text-zinc-600">Las fotos se enviarán al cliente como evidencia del trabajo.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setShowReporte(false)} className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={handleEnviarReporte} className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <Send size={16}/> Finalizar y notificar
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-sm uppercase tracking-widest">Volver</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
            <Bike size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">{vehiculo?.marca} {vehiculo?.modelo}</h2>
            <p className="text-zinc-500 font-medium">
              Placa: <span className="text-zinc-300">{vehiculo?.placa}</span> • <span className="text-zinc-300">{vehiculo?.año}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-bold">
            <Wrench size={16} /> {vehiculo?.estado || "Sin Atender"}
          </div>
          {vehiculo?.estado !== "Finalizada" && (
            <button onClick={handleActualizarEstado} className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              {vehiculo?.estado === "En Proceso" ? "Finalizar servicio" : "Avanzar estado"}
            </button>
          )}
        </div>
      </div>

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

      <div className="bg-zinc-950/50 p-1.5 rounded-2xl border border-zinc-800 inline-flex flex-wrap w-full lg:w-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 lg:flex-none ${activeTab === tab ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'General' && (
          <div className="animate-in space-y-6">
            <section className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8 text-zinc-400">
                <FileText size={20} /> <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Ficha Técnica</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
                <InfoBlock label="Marca" value={vehiculo?.marca || '—'} />
                <InfoBlock label="Modelo" value={vehiculo?.modelo || '—'} />
                <InfoBlock label="Placa" value={vehiculo?.placa || '—'} />
                <InfoBlock label="Año" value={vehiculo?.año || '—'} />
                <InfoBlock label="Color" value={vehiculo?.color || '—'} />
                <InfoBlock label="Ingreso" value={vehiculo?.ingreso || '—'} />
                <InfoBlock label="Técnico asignado" value={vehiculo?.tecnico || 'Por asignar'} />
                {vehiculo?.ultimoCambioEstado && <InfoBlock label="Último cambio de estado" value={vehiculo.ultimoCambioEstado} />}
              </div>
            </section>
            <section className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-8 text-zinc-400">
                <User size={20} /> <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Propietario</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8">
                <InfoBlock label="Cliente" value={vehiculo?.cliente || '—'} />
                <InfoBlock label="Teléfono" value={vehiculo?.telefono || '—'} />
              </div>
            </section>
            {vehiculo?.reporteEntrega && (
              <section className="bg-zinc-950 border border-green-500/20 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6 text-green-400">
                  <Check size={20} /><h3 className="text-lg font-bold uppercase tracking-tighter">Reporte de Entrega</h3>
                </div>
                <p className="text-zinc-300 mb-4">{vehiculo.reporteEntrega.descripcion}</p>
                {vehiculo.reporteEntrega.recomendaciones && (
                  <div className="mb-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Recomendaciones</p>
                    <p className="text-zinc-300 text-sm">{vehiculo.reporteEntrega.recomendaciones}</p>
                  </div>
                )}
                <p className="text-2xl font-black text-green-400 mb-4">{fmtCOP(vehiculo.reporteEntrega.valorTotal)}</p>
                {(vehiculo.reporteEntrega.fotos || []).length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {vehiculo.reporteEntrega.fotos.map((f, i) => (
                      <img key={i} src={f} alt={`reporte-${i}`} className="w-full h-24 object-cover rounded-xl border border-zinc-800"/>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {activeTab === 'Servicio' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-8 text-zinc-400">
              <Wrench size={22} className="text-blue-500" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Servicios Cotizados</h3>
            </div>
            {serviciosCotizados.length === 0 ? (
              <p className="text-zinc-500">Aún no se han cotizado servicios para este vehículo.</p>
            ) : (
              <div className="space-y-3">
                {serviciosCotizados.map((sc, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                    <span className="text-white font-semibold">{sc.titulo || sc.nombre || sc.item}</span>
                    <span className="text-green-400 font-bold">{fmtCOP(parsePrecio(sc.precio ?? sc.valor))}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'Costos' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-3 mb-6 text-zinc-400">
              <DollarSign size={22} className="text-green-500" />
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Resumen de Costos</h3>
            </div>
            <div className="space-y-3 mb-6">
              <CostRow label="Servicios cotizados" amount={totalServiciosCotizados} />
              <CostRow label="Repuestos" amount={totalRepuestos} />
            </div>
            <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 flex justify-between items-center">
              <span className="text-xl font-black text-white uppercase">Total</span>
              <span className="text-3xl font-black text-green-500">{fmtCOP(totalGeneral)}</span>
            </div>
          </section>
        )}

        {activeTab === 'Repuestos' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 md:p-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 text-zinc-400">
                <Package size={22} className="text-blue-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Repuestos Utilizados</h3>
              </div>
              <button
                onClick={() => setShowAddRepuesto(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={16}/> Agregar repuesto
              </button>
            </div>
            {repuestos.length === 0 ? (
              <p className="text-zinc-500">No se han registrado repuestos en este servicio.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900">
                    <th className="pb-3">Repuesto</th>
                    <th className="pb-3 text-center">Cant.</th>
                    <th className="pb-3 text-right">Precio</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 divide-y divide-zinc-900">
                  {repuestos.map((r, i) => (
                    <tr key={i}>
                      <td className="py-3 font-semibold">{r.nombre}</td>
                      <td className="py-3 text-center">{r.cantidad}</td>
                      <td className="py-3 text-right">{fmtCOP(parsePrecio(r.precio))}</td>
                      <td className="py-3 text-right font-bold">{fmtCOP(parsePrecio(r.precio) * (Number(r.cantidad) || 1))}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const nuevos = repuestos.filter((_, idx) => idx !== i);
                            onUpdate && onUpdate({ ...vehiculo, repuestos: nuevos });
                          }}
                          className="text-zinc-600 hover:text-red-400"
                          title="Quitar repuesto"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'Evidencias' && (
          <section className="animate-in bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 md:p-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 text-zinc-400">
                <Camera size={22} className="text-purple-500" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Evidencias enviadas al cliente</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-1 rounded-md">Solo lectura</span>
            </div>
            <p className="text-xs text-zinc-500 mb-6">Estas son las fotos que el taller adjuntó al reporte de entrega y que el cliente ya puede ver desde su portal. Se gestionan desde el reporte al finalizar el servicio.</p>
            {evidencias.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[2rem] text-zinc-600">
                <ImageIcon size={56} strokeWidth={1} className="mb-3 opacity-30" />
                <p className="font-bold">Aún no se han enviado evidencias al cliente.</p>
                <p className="text-xs text-zinc-600 mt-1">Adjunta fotos cuando finalices el servicio para que aparezcan aquí.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {evidencias.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className="block group">
                    <img src={src} alt={`ev-${i}`} className="w-full h-36 object-cover rounded-2xl border border-zinc-800 group-hover:border-purple-500/40 transition-colors"/>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {showAddRepuesto && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setShowAddRepuesto(false)}>
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-md my-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">Agregar repuesto</h3>
              <button onClick={() => setShowAddRepuesto(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Repuesto</label>
                <select
                  value={nuevoRepuesto.itemId}
                  onChange={(e) => setNuevoRepuesto(p => ({ ...p, itemId: e.target.value }))}
                  className="w-full mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona un repuesto del inventario…</option>
                  {inventario
                    .filter(it => (!tallerActivo?.id || it.tallerId === tallerActivo.id) && Number(it.stock || 0) > 0)
                    .map(it => (
                      <option key={it.id} value={it.id}>
                        {it.nombre} — Stock: {it.stock} — {fmtCOP(parsePrecio(it.precio))}
                      </option>
                    ))}
                </select>
                {inventario.filter(it => (!tallerActivo?.id || it.tallerId === tallerActivo.id) && Number(it.stock || 0) > 0).length === 0 && (
                  <p className="text-xs text-amber-400 mt-2">No hay repuestos con stock disponible en este taller.</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={nuevoRepuesto.cantidad}
                  onChange={(e) => setNuevoRepuesto(p => ({ ...p, cantidad: Math.max(1, Number(e.target.value) || 1) }))}
                  className="w-full mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddRepuesto(false)} className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white">Cancelar</button>
                <button
                  onClick={() => {
                    const it = inventario.find(x => x.id === nuevoRepuesto.itemId);
                    if (!it) { showToast("Selecciona un repuesto."); return; }
                    const cant = Math.max(1, Number(nuevoRepuesto.cantidad) || 1);
                    if (cant > Number(it.stock || 0)) { showToast(`Stock insuficiente. Disponible: ${it.stock}`); return; }
                    const ok = descontarStock({ id: it.id }, cant, tallerActivo?.id);
                    if (!ok) { showToast("No se pudo descontar del inventario."); return; }
                    const nuevos = [...repuestos, {
                      itemId: it.id,
                      nombre: it.nombre,
                      codigo: it.codigo || "",
                      precio: it.precio,
                      cantidad: cant,
                    }];
                    onUpdate && onUpdate({ ...vehiculo, repuestos: nuevos });
                    setShowAddRepuesto(false);
                    setNuevoRepuesto({ itemId: "", cantidad: 1 });
                    showToast(`Repuesto agregado y descontado del inventario (-${cant}).`);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center gap-2"
                >
                  <Check size={16}/> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
    <p className="text-zinc-200 font-bold text-lg">{value}</p>
  </div>
);

const CostRow = ({ label, amount }) => (
  <div className="flex justify-between items-center p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
    <span className="text-zinc-300 font-medium">{label}</span>
    <span className="text-white font-bold">{fmtCOP(amount)}</span>
  </div>
);
