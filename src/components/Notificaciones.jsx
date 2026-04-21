import React, { useState } from "react";
import {
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  FileText,
  DollarSign,
  UserPlus,
  X,
  Check,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "alerta",
    title: "Stock Bajo",
    desc: "El filtro de aceite K&N está por debajo del stock mínimo",
    time: "Hace 5 min",
    read: false,
    icon: <AlertTriangle size={18} className="text-orange-400" />,
    iconBg: "bg-orange-500/20",
    dot: "bg-orange-400",
  },
  {
    id: 2,
    type: "cita",
    title: "Nueva Cita Agendada",
    desc: "Carlos Rodríguez agendó una cita para mañana a las 10:00 AM",
    time: "Hace 15 min",
    read: false,
    icon: <Bell size={18} className="text-purple-400" />,
    iconBg: "bg-purple-500/20",
    dot: "bg-purple-400",
  },
  {
    id: 3,
    type: "completado",
    title: "Servicio Completado",
    desc: "El mantenimiento de la moto ABC-123 ha sido completado",
    time: "Hace 1 hora",
    read: false,
    icon: <CheckCircle size={18} className="text-green-400" />,
    iconBg: "bg-green-500/20",
    dot: "bg-green-400",
  },
  {
    id: 4,
    type: "mensaje",
    title: "Mensaje de Cliente",
    desc: "María Fernández pregunta por el estado de su vehículo",
    time: "Hace 2 horas",
    read: true,
    icon: <MessageSquare size={18} className="text-blue-400" />,
    iconBg: "bg-blue-500/20",
    dot: null,
  },
  {
    id: 5,
    type: "cita",
    title: "Recordatorio de Cita",
    desc: "Juan Pérez tiene una cita en 1 hora",
    time: "Hace 3 horas",
    read: true,
    icon: <Calendar size={18} className="text-purple-400" />,
    iconBg: "bg-purple-500/20",
    dot: null,
  },
  {
    id: 6,
    type: "alerta",
    title: "Factura Vencida",
    desc: "La factura INV-2025-003 está vencida desde hace 5 días",
    time: "Hace 1 día",
    read: true,
    icon: <FileText size={18} className="text-orange-400" />,
    iconBg: "bg-orange-500/20",
    dot: null,
  },
  {
    id: 7,
    type: "completado",
    title: "Pago Recibido",
    desc: "Se recibió el pago de $850,000 de Ana Martínez",
    time: "Hace 2 días",
    read: true,
    icon: <DollarSign size={18} className="text-green-400" />,
    iconBg: "bg-green-500/20",
    dot: null,
  },
  {
    id: 8,
    type: "cita",
    title: "Nuevo Empleado",
    desc: "Laura Sánchez se unió al equipo del taller",
    time: "Hace 3 días",
    read: true,
    icon: <UserPlus size={18} className="text-purple-400" />,
    iconBg: "bg-purple-500/20",
    dot: null,
  },
];

export function Notificaciones() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unread = notifications.filter((n) => !n.read).length;
  const citasHoy = notifications.filter((n) => n.type === "cita").length;
  const alertas = notifications.filter((n) => n.type === "alerta").length;
  const completados = notifications.filter((n) => n.type === "completado").length;

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, dot: null } : n))
    );

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, dot: null }))
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
          <p className="text-gray-400 text-sm mt-1">
            Mantente al día con las actividades del taller
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <span className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full font-medium">
              {unread} no leídas
            </span>
          )}
          <button
            onClick={markAllRead}
            className="text-sm px-4 py-2 border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-colors"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "No Leídas",
            value: unread,
            icon: <Bell size={18} className="text-purple-400" />,
            bg: "bg-purple-500/10 border-purple-500/20",
            text: "text-purple-400",
          },
          {
            label: "Citas Hoy",
            value: citasHoy,
            icon: <Calendar size={18} className="text-blue-400" />,
            bg: "bg-blue-500/10 border-blue-500/20",
            text: "text-blue-400",
          },
          {
            label: "Alertas",
            value: alertas,
            icon: <AlertTriangle size={18} className="text-orange-400" />,
            bg: "bg-orange-500/10 border-orange-500/20",
            text: "text-orange-400",
          },
          {
            label: "Completados",
            value: completados,
            icon: <CheckCircle size={18} className="text-green-400" />,
            bg: "bg-green-500/10 border-green-500/20",
            text: "text-green-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`border rounded-2xl p-4 flex items-center gap-3 ${s.bg}`}
          >
            <div className="flex-shrink-0">{s.icon}</div>
            <div>
              <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-40" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                !n.read ? "bg-gray-800/40" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`}
              >
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  {n.dot && (
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                <div className="flex items-center gap-4 mt-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Check size={12} />
                      Marcar como leída
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(n.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                    Descartar
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 flex-shrink-0 mt-0.5">{n.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
