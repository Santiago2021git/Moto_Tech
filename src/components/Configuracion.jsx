import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  FileText,
  Users,
  Save,
  ChevronDown,
  UserPlus,
  Monitor,
  Smartphone,
} from "lucide-react";

// ─── shared input styles ───────────────────────────────────────────────────
const inputClass =
  "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors";
const labelClass = "block text-xs font-medium text-cyan-400 mb-1.5";

// ─── Toggle component ──────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-gray-800 border border-cyan-500" : "bg-gray-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform ${
          checked
            ? "translate-x-5 bg-cyan-400"
            : "translate-x-0 bg-gray-500"
        }`}
      />
    </button>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

// ─── Tab: General ─────────────────────────────────────────────────────────
function TabGeneral() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className="space-y-5">
      <Section title="Información del Taller">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nombre del Taller</label>
            <input className={inputClass} defaultValue="MotoTech" />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input className={inputClass} defaultValue="+57 601 234 5678" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} defaultValue="contacto@mototech.co" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Dirección</label>
            <input
              className={inputClass}
              defaultValue="Calle 100 #15-20, Bogotá"
            />
          </div>
          <div>
            <label className={labelClass}>Horario de Atención</label>
            <input
              className={inputClass}
              defaultValue="Lun-Sáb 8:00 AM - 6:00 PM"
            />
          </div>
          <div>
            <label className={labelClass}>Zona Horaria</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
                <option>America/Bogota (GMT-5)</option>
                <option>America/New_York (GMT-4)</option>
                <option>Europe/Madrid (GMT+2)</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Preferencias de Interfaz">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Modo Oscuro</p>
              <p className="text-xs text-cyan-400 mt-0.5">
                Activa el tema oscuro en toda la aplicación
              </p>
            </div>
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Idioma</p>
              <p className="text-xs text-cyan-400 mt-0.5">
                Selecciona el idioma de la interfaz
              </p>
            </div>
            <div className="relative">
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-100 appearance-none pr-8 focus:outline-none focus:border-cyan-500 cursor-pointer">
                <option>Español</option>
                <option>English</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          <Save size={15} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Notificaciones ──────────────────────────────────────────────────
const notifPrefs = [
  { key: "nuevasCitas", label: "Nuevas Citas", desc: "Recibe notificaciones cuando se agende una nueva cita", default: true },
  { key: "stockBajo", label: "Stock Bajo", desc: "Alerta cuando un repuesto esté por debajo del stock mínimo", default: true },
  { key: "servicios", label: "Servicios Completados", desc: "Notificación cuando se complete un servicio", default: true },
  { key: "mensajes", label: "Mensajes de Clientes", desc: "Recibe notificaciones de mensajes de clientes", default: true },
  { key: "reportes", label: "Reportes Semanales", desc: "Recibe un resumen semanal de las actividades del taller", default: false },
];

const notifChannels = [
  { key: "email", label: "Notificaciones por Email", desc: "Enviar notificaciones a contacto@mototech.co", default: true },
  { key: "sms", label: "Notificaciones SMS", desc: "Enviar notificaciones por mensaje de texto", default: false },
  { key: "push", label: "Notificaciones Push", desc: "Recibir notificaciones en el navegador", default: true },
];

function TabNotificaciones() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(notifPrefs.map((p) => [p.key, p.default]))
  );
  const [channels, setChannels] = useState(
    Object.fromEntries(notifChannels.map((c) => [c.key, c.default]))
  );

  return (
    <div className="space-y-5">
      <Section title="Preferencias de Notificaciones">
        <div className="space-y-4">
          {notifPrefs.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{p.label}</p>
                <p className="text-xs text-cyan-400 mt-0.5">{p.desc}</p>
              </div>
              <Toggle
                checked={prefs[p.key]}
                onChange={(v) => setPrefs((prev) => ({ ...prev, [p.key]: v }))}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Canales de Notificación">
        <div className="space-y-4">
          {notifChannels.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{c.label}</p>
                <p className="text-xs text-cyan-400 mt-0.5">{c.desc}</p>
              </div>
              <Toggle
                checked={channels[c.key]}
                onChange={(v) =>
                  setChannels((prev) => ({ ...prev, [c.key]: v }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          <Save size={15} />
          Guardar Preferencias
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Seguridad ───────────────────────────────────────────────────────
function TabSeguridad() {
  const sessions = [
    { device: "Chrome en Windows", location: "Bogotá, Colombia", time: "Activo ahora", current: true },
    { device: "Safari en iPhone", location: "Bogotá, Colombia", time: "Hace 2 días", current: false },
  ];

  return (
    <div className="space-y-5">
      <Section title="Cambiar Contraseña">
        <div className="space-y-4 max-w-sm">
          <div>
            <label className={labelClass}>Contraseña Actual</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>Nueva Contraseña</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>Confirmar Nueva Contraseña</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
          <button className="px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
            Actualizar Contraseña
          </button>
        </div>
      </Section>

      <Section title="Autenticación de Dos Factores">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">2FA</p>
            <p className="text-xs text-cyan-400 mt-0.5">
              Agrega una capa extra de seguridad a tu cuenta
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-700 text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-colors">
            Configurar
          </button>
        </div>
      </Section>

      <Section title="Sesiones Activas">
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.device}
              className="flex items-center justify-between gap-4 bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {s.device.includes("iPhone") ? (
                  <Smartphone size={18} className="text-gray-400" />
                ) : (
                  <Monitor size={18} className="text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">{s.device}</p>
                  <p className="text-xs text-gray-500">
                    {s.location} · {s.time}
                  </p>
                </div>
              </div>
              {s.current ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-medium">
                  Actual
                </span>
              ) : (
                <button className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                  Cerrar Sesión
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Tab: Facturación ─────────────────────────────────────────────────────
const paymentMethods = [
  { key: "efectivo", label: "Efectivo", default: true },
  { key: "tarjeta", label: "Tarjeta de Crédito/Débito", default: true },
  { key: "transferencia", label: "Transferencia Bancaria", default: true },
  { key: "nequi", label: "Nequi/Daviplata", default: false },
];

function TabFacturacion() {
  const [methods, setMethods] = useState(
    Object.fromEntries(paymentMethods.map((m) => [m.key, m.default]))
  );

  return (
    <div className="space-y-5">
      <Section title="Configuración de Facturación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Razón Social</label>
            <input className={inputClass} defaultValue="MotoTech S.A.S" />
          </div>
          <div>
            <label className={labelClass}>NIT</label>
            <input className={inputClass} defaultValue="900.123.456-7" />
          </div>
          <div>
            <label className={labelClass}>Régimen Tributario</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
                <option>Régimen Común</option>
                <option>Régimen Simplificado</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>IVA por Defecto (%)</label>
            <input className={inputClass} defaultValue="19" />
          </div>
          <div>
            <label className={labelClass}>Prefijo de Factura</label>
            <input className={inputClass} defaultValue="INV-2025-" />
          </div>
          <div>
            <label className={labelClass}>Número de Factura Inicial</label>
            <input className={inputClass} defaultValue="001" />
          </div>
        </div>
      </Section>

      <Section title="Métodos de Pago Aceptados">
        <div className="space-y-4">
          {paymentMethods.map((m) => (
            <div key={m.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-gray-500" />
                <p className="text-sm text-white">{m.label}</p>
              </div>
              <Toggle
                checked={methods[m.key]}
                onChange={(v) =>
                  setMethods((prev) => ({ ...prev, [m.key]: v }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          <Save size={15} />
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Equipo ──────────────────────────────────────────────────────────
const teamMembers = [
  { initials: "RG", name: "Roberto Gómez", email: "roberto.g@mototech.com", color: "from-red-500 to-orange-500" },
  { initials: "LS", name: "Laura Sánchez", email: "laura.s@mototech.com", color: "from-purple-500 to-blue-500" },
];

function TabEquipo() {
  return (
    <div className="space-y-5">
      <Section title="Permisos del Equipo">
        <div className="flex justify-end -mt-2 mb-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-colors">
            <UserPlus size={15} />
            Invitar Miembro
          </button>
        </div>
        <div className="space-y-3">
          {teamMembers.map((m) => (
            <div
              key={m.email}
              className="flex items-center justify-between gap-4 bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {m.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <div className="relative">
                <select className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-gray-300 appearance-none pr-8 focus:outline-none focus:border-cyan-500 cursor-pointer">
                  <option>Administrador</option>
                  <option>Técnico</option>
                  <option>Recepcionista</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Main Configuracion component ─────────────────────────────────────────
const tabConfig = [
  { key: "general", label: "General", icon: <Settings size={15} /> },
  { key: "notificaciones", label: "Notificaciones", icon: <Bell size={15} /> },
  { key: "seguridad", label: "Seguridad", icon: <Shield size={15} /> },
  { key: "facturacion", label: "Facturación", icon: <FileText size={15} /> },
  { key: "equipo", label: "Equipo", icon: <Users size={15} /> },
];

import { usePageTitle } from '../hooks/usePageTitle';

export function Configuracion() {
  usePageTitle("Configuración");
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general": return <TabGeneral />;
      case "notificaciones": return <TabNotificaciones />;
      case "seguridad": return <TabSeguridad />;
      case "facturacion": return <TabFacturacion />;
      case "equipo": return <TabEquipo />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400 text-sm mt-1">
          Administra las preferencias del taller
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-2xl p-1 overflow-x-auto">
        {tabConfig.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${
              activeTab === t.key
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  );
}
