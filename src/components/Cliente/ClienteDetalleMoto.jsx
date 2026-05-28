import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft, Bike, Calendar, User as UserIcon, Wrench,
  Clock, CheckCircle, AlertCircle, FileText, Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { motosDemo } from "../../data/clientes";
import { usePageTitle } from "../../hooks/usePageTitle";

const estadoStyle = {
  "En Proceso": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Finalizada": "bg-green-500/10 text-green-400 border-green-500/30",
  "Sin Atender": "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

const estadoIcon = {
  "En Proceso": <Clock size={14} />,
  "Finalizada": <CheckCircle size={14} />,
  "Sin Atender": <AlertCircle size={14} />,
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const ClienteDetalleMoto = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const moto = motosDemo.find((m) => m.id === id && m.clienteId === user?.id);

  usePageTitle(moto ? `${moto.marca} ${moto.modelo}` : "Moto");

  if (!moto) return <Navigate to="/cliente" replace />;

  // Solo eventos visibles para el cliente (RF-10)
  const eventos = moto.historial.filter((h) => h.visibleCliente);

  const total = moto.serviciosCotizados.reduce((s, x) => s + x.valor, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/cliente" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 mb-4">
        <ArrowLeft size={16} /> Volver a mis motos
      </Link>

      {/* HERO */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Bike size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {moto.marca} {moto.modelo}
              </h1>
              <p className="text-sm text-gray-400">
                Placa <span className="text-white">{moto.placa}</span> · {moto.año} · {moto.color}
              </p>
              <p className="text-xs text-gray-500 mt-1">Orden de servicio: {moto.ordenServicio}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border self-start ${
              estadoStyle[moto.estado]
            }`}
          >
            {estadoIcon[moto.estado]} {moto.estado}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Stat icon={<Calendar size={16} />} label="Ingreso" value={moto.ingreso} />
          <Stat icon={<Calendar size={16} />} label="Entrega estimada" value={moto.entregaEstimada} highlight />
          <Stat icon={<UserIcon size={16} />} label="Técnico asignado" value={moto.tecnico} />
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Avance del servicio</span>
            <span className="text-white font-semibold">{moto.avance}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${moto.avance}%` }}
            />
          </div>
        </div>
      </div>

      {/* DIAGNÓSTICO */}
      <Card title="Diagnóstico inicial" icon={<Wrench size={18} className="text-purple-400" />}>
        <p className="text-sm text-gray-300 leading-relaxed">{moto.diagnostico}</p>
      </Card>

      {/* TIMELINE */}
      <Card title="Seguimiento del proceso" icon={<Clock size={18} className="text-purple-400" />}>
        {eventos.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay actualizaciones del taller.</p>
        ) : (
          <ol className="relative border-l border-gray-800 ml-3 space-y-6">
            {eventos.map((ev, i) => (
              <li key={i} className="ml-6">
                <span className="absolute -left-[7px] mt-1.5 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-gray-900" />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-white font-medium text-sm">{ev.titulo}</h4>
                  <time className="text-xs text-gray-500">{ev.fecha}</time>
                </div>
                <p className="text-sm text-gray-400 mt-1">{ev.descripcion}</p>
                {ev.foto && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-800 max-w-md">
                    <img
                      src={ev.foto}
                      alt={ev.titulo}
                      className="w-full h-44 object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
                {!ev.foto && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gray-600">
                    <ImageIcon size={11} /> sin evidencia visual
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* COTIZACIÓN */}
      <Card title="Servicios y cotización" icon={<FileText size={18} className="text-purple-400" />}>
        {moto.serviciosCotizados.length === 0 ? (
          <p className="text-sm text-gray-500">
            La cotización detallada aún no está disponible. El taller la compartirá tras el diagnóstico.
          </p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-800">
              {moto.serviciosCotizados.map((s, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-gray-300">{s.item}</span>
                  <span className="text-white font-medium">{fmtCurrency(s.valor)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-800">
              <span className="text-gray-400 text-sm">Total estimado</span>
              <span className="text-lg font-bold text-purple-400">{fmtCurrency(total)}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

function Stat({ icon, label, value, highlight }) {
  return (
    <div
      className={`rounded-xl px-4 py-3 border ${
        highlight ? "bg-purple-500/10 border-purple-500/30" : "bg-gray-950/50 border-gray-800"
      }`}
    >
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className={`text-sm font-semibold mt-1 ${highlight ? "text-purple-300" : "text-white"}`}>{value}</p>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-6">
      <h2 className="flex items-center gap-2 text-white font-semibold mb-4">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}
