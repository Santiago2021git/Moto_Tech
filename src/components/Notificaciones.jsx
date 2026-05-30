import React from "react";
import {
  Bell, Calendar, AlertTriangle, CheckCircle, MessageSquare, X, Check,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";

const ICONOS = {
  alerta:     { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/20", dot: "bg-orange-400" },
  cita:       { icon: Calendar,      color: "text-purple-400", bg: "bg-purple-500/20", dot: "bg-purple-400" },
  completado: { icon: CheckCircle,   color: "text-green-400",  bg: "bg-green-500/20",  dot: "bg-green-400"  },
  mensaje:    { icon: MessageSquare, color: "text-blue-400",   bg: "bg-blue-500/20",   dot: "bg-blue-400"   },
  default:    { icon: Bell,          color: "text-zinc-400",   bg: "bg-zinc-500/20",   dot: "bg-zinc-400"   },
};

function tiempoRelativo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)    return "hace un momento";
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;
  return d.toLocaleDateString("es-CO");
}

export function Notificaciones() {
  usePageTitle("Notificaciones");
  const { notificaciones, marcarNotificacionLeida, marcarTodasLeidas, eliminarNotificacion } = useApp();
  const { tallerActivo } = useAuth();

  const mias = notificaciones.filter((n) => n.tallerId === tallerActivo?.id);

  const unread     = mias.filter((n) => !n.leida).length;
  const citas      = mias.filter((n) => n.tipo === "cita").length;
  const alertas    = mias.filter((n) => n.tipo === "alerta").length;
  const completados = mias.filter((n) => n.tipo === "completado").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
          <p className="text-gray-400 text-sm mt-1">Actividad reciente del taller</p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <span className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full font-medium">
              {unread} no leídas
            </span>
          )}
          <button
            onClick={() => marcarTodasLeidas({ tallerId: tallerActivo?.id })}
            className="text-sm px-4 py-2 border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-colors"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="No leídas"   value={unread}      icon={Bell}           color="purple" />
        <Card label="Citas"       value={citas}       icon={Calendar}       color="blue" />
        <Card label="Alertas"     value={alertas}     icon={AlertTriangle}  color="orange" />
        <Card label="Completados" value={completados} icon={CheckCircle}    color="green" />
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
        {mias.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-40" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          mias.map((n) => {
            const cfg = ICONOS[n.tipo] || ICONOS.default;
            const Icon = cfg.icon;
            return (
              <div key={n.id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.leida ? "bg-gray-800/40" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{n.titulo}</p>
                    {!n.leida && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{n.mensaje}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {!n.leida && (
                      <button onClick={() => marcarNotificacionLeida(n.id)} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                        <Check size={12} /> Marcar como leída
                      </button>
                    )}
                    <button onClick={() => eliminarNotificacion(n.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400">
                      <X size={12} /> Descartar
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0 mt-0.5">{tiempoRelativo(n.fecha)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const Card = ({ label, value, icon: Icon, color }) => (
  <div className={`border rounded-2xl p-4 flex items-center gap-3 bg-${color}-500/10 border-${color}-500/20`}>
    <Icon size={18} className={`text-${color}-400`} />
    <div>
      <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);
