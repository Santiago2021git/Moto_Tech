import React, { useState, useEffect } from "react";
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
  Check,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../auth/AuthContext";

const THEME_KEY = "mototech_theme";
const SETTINGS_KEY = "mototech_settings_v1";
const readTheme = () => {
  try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; }
};
const applyTheme = (mode) => {
  if (mode === "light") document.documentElement.classList.add("light-mode");
  else document.documentElement.classList.remove("light-mode");
};
// Aplica el tema en arranque (antes de renderizar la primera vez)
applyTheme(readTheme());

const readSettings = () => {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { return {}; }
};
const writeSettings = (patch) => {
  try {
    const prev = readSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...prev, ...patch }));
  } catch {}
};

// Hook: estado persistido en localStorage bajo SETTINGS_KEY[scope]
function usePersistedState(scope, initial) {
  const [value, setValue] = useState(() => {
    const all = readSettings();
    return { ...initial, ...(all[scope] || {}) };
  });
  const persist = () => writeSettings({ [scope]: value });
  return [value, setValue, persist];
}

function useSavedToast() {
  const [saved, setSaved] = useState(false);
  const trigger = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  return [saved, trigger];
}

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
  const { tallerActivo } = useAuth();
  const [mode, setMode] = useState(readTheme());
  const [saved, trigger] = useSavedToast();
  const darkMode = mode === "dark";
  const toggleMode = (next) => {
    const m = next ? "dark" : "light";
    setMode(m);
    applyTheme(m);
    try { localStorage.setItem(THEME_KEY, m); } catch {}
  };
  const guardar = () => {
    // Tema ya se persiste en cada toggle; el botón confirma con feedback visual.
    try { localStorage.setItem(THEME_KEY, mode); } catch {}
    trigger();
  };
  return (
    <div className="space-y-5">
      <Section title="Información del Taller">
        {tallerActivo ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              {tallerActivo.logoBase64 ? (
                <img src={tallerActivo.logoBase64} alt={tallerActivo.nombre} className="w-14 h-14 rounded-2xl object-cover border border-gray-700"/>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg">
                  {tallerActivo.iniciales || "MT"}
                </div>
              )}
              <div>
                <p className="text-base font-bold text-white">{tallerActivo.nombre}</p>
                <p className="text-xs text-gray-400">{tallerActivo.eslogan || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoLine icon={Mail} label="Email" value={tallerActivo.email} />
              <InfoLine icon={Phone} label="Teléfono" value={tallerActivo.telefono} />
              <InfoLine icon={MapPin} label="Dirección" value={tallerActivo.direccion} />
              <InfoLine icon={Building2} label="Ciudad" value={tallerActivo.ciudad} />
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-300 mt-3">
              Para editar estos datos, ve a <strong>"Perfil del Taller"</strong> en el menú lateral.
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No hay un taller activo en sesión.</p>
        )}
      </Section>

      <Section title="Preferencias de Interfaz">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Modo Oscuro</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Activa el tema oscuro en toda la aplicación
              </p>
            </div>
            <Toggle checked={darkMode} onChange={toggleMode} />
          </div>
        </div>
      </Section>

      <div className="flex justify-end items-center gap-3">
        {saved && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Check size={14}/> Cambios guardados</span>}
        <button onClick={guardar} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          <Save size={15} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

const InfoLine = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2 bg-gray-950/40 border border-gray-800 rounded-xl px-3 py-2">
    <Icon size={14} className="text-cyan-400 mt-0.5 shrink-0"/>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-sm text-white font-medium truncate">{value || "—"}</p>
    </div>
  </div>
);

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
  const all = readSettings();
  const [prefs, setPrefs] = useState(
    { ...Object.fromEntries(notifPrefs.map((p) => [p.key, p.default])), ...(all.notifPrefs || {}) }
  );
  const [channels, setChannels] = useState(
    { ...Object.fromEntries(notifChannels.map((c) => [c.key, c.default])), ...(all.notifChannels || {}) }
  );
  const [saved, trigger] = useSavedToast();
  const guardar = () => {
    writeSettings({ notifPrefs: prefs, notifChannels: channels });
    trigger();
  };

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

      <div className="flex justify-end items-center gap-3">
        {saved && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Check size={14}/> Preferencias guardadas</span>}
        <button onClick={guardar} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
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
  const all = readSettings();
  const { tallerActivo } = useAuth();
  const [methods, setMethods] = useState(
    { ...Object.fromEntries(paymentMethods.map((m) => [m.key, m.default])), ...(all.billingMethods || {}) }
  );
  const [fields, setFields] = useState({
    razonSocial: tallerActivo?.razonSocial || tallerActivo?.nombre || "",
    nit: tallerActivo?.nit || "",
    regimen: "Régimen Común",
    iva: "19",
    prefijo: `INV-${new Date().getFullYear()}-`,
    consecutivo: "001",
    ...(all.billingFields || {}),
  });
  const [saved, trigger] = useSavedToast();
  const guardar = () => {
    writeSettings({ billingMethods: methods, billingFields: fields });
    trigger();
  };

  return (
    <div className="space-y-5">
      <Section title="Configuración de Facturación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Razón Social</label>
            <input className={inputClass} value={fields.razonSocial} onChange={(e) => setFields(f => ({ ...f, razonSocial: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>NIT</label>
            <input className={inputClass} value={fields.nit} onChange={(e) => setFields(f => ({ ...f, nit: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Régimen Tributario</label>
            <div className="relative">
              <select className={`${inputClass} appearance-none pr-10 cursor-pointer`} value={fields.regimen} onChange={(e) => setFields(f => ({ ...f, regimen: e.target.value }))}>
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
            <input className={inputClass} value={fields.iva} onChange={(e) => setFields(f => ({ ...f, iva: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Prefijo de Factura</label>
            <input className={inputClass} value={fields.prefijo} onChange={(e) => setFields(f => ({ ...f, prefijo: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Número de Factura Inicial</label>
            <input className={inputClass} value={fields.consecutivo} onChange={(e) => setFields(f => ({ ...f, consecutivo: e.target.value }))} />
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

      <div className="flex justify-end items-center gap-3">
        {saved && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Check size={14}/> Configuración guardada</span>}
        <button onClick={guardar} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          <Save size={15} />
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Equipo ──────────────────────────────────────────────────────────
function TabEquipo() {
  const { empleados } = useApp();
  const { tallerActivo } = useAuth();
  const tallerId = tallerActivo?.id;
  const team = empleados.filter(e => !tallerId || e.tallerId === tallerId);
  const palette = [
    "from-red-500 to-orange-500",
    "from-purple-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-cyan-500 to-blue-600",
    "from-pink-500 to-rose-600",
  ];
  return (
    <div className="space-y-5">
      <Section title="Permisos del Equipo">
        <div className="flex justify-end -mt-2 mb-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-colors">
            <UserPlus size={15} />
            Invitar Miembro
          </button>
        </div>
        {team.length === 0 && (
          <p className="text-sm text-gray-500">Aún no hay empleados registrados. Regístralos desde la sección <strong>Empleados</strong>.</p>
        )}
        <div className="space-y-3">
          {team.map((m, i) => {
            const iniciales = m.iniciales || (m.nombre || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
            const permiso = m.permiso || m.rol || m.cargo || "Técnico";
            return (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 bg-gray-800/40 border border-gray-700/50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${palette[i % palette.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {iniciales}
                  </div>
                  <p className="text-sm font-medium text-white">{m.nombre}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                  {permiso}
                </span>
              </div>
            );
          })}
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
