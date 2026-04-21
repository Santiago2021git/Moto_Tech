import React, { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";

const statCards = [
  {
    label: "Servicios Gestionados",
    value: "1,247",
    badge: "+12% este mes",
    badgeColor: "text-green-400",
    icon: <TrendingUp size={18} className="text-cyan-400" />,
  },
  {
    label: "Clientes Atendidos",
    value: "534",
    badge: "+8% este mes",
    badgeColor: "text-green-400",
    icon: <TrendingUp size={18} className="text-purple-400" />,
  },
  {
    label: "Rating Promedio",
    value: "4.9",
    badge: "de 5.0",
    badgeColor: "text-gray-400",
    icon: <Star size={18} className="text-yellow-400" />,
  },
  {
    label: "Años de Experiencia",
    value: "15",
    badge: "años",
    badgeColor: "text-gray-400",
    icon: <Award size={18} className="text-orange-400" />,
  },
];

const inputClass =
  "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors";

const labelClass = "block text-xs font-medium text-cyan-400 mb-1.5";

export function Perfil() {
  const [form, setForm] = useState({
    nombre: "Miguel",
    apellido: "González",
    email: "miguel.gonzalez@mototech.co",
    telefono: "+57 310 123 4567",
    fechaNacimiento: "15/05/1985",
    direccion: "Calle 100 #15-20, Bogotá",
    biografia:
      "Administrador del taller MotoTech con más de 15 años de experiencia en el sector automotriz. Especializado en gestión de talleres y atención al cliente.",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="text-gray-400 text-sm mt-1">
          Administra tu información personal
        </p>
      </div>

      {/* Cover + avatar card */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="relative h-36 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-500">
          <button className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/30 hover:bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
            <Camera size={13} />
            Cambiar Cover
          </button>
        </div>

        {/* Avatar row */}
        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-8">
            <div className="flex items-end gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-gray-900 shadow-lg">
                  MG
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-900 transition-colors">
                  <Camera size={13} className="text-gray-300" />
                </button>
              </div>
              <div className="mb-1">
                <p className="font-bold text-white text-lg leading-tight">
                  Miguel González
                </p>
                <p className="text-gray-400 text-sm">Administrador del Sistema</p>
                <span className="inline-block mt-1 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                  Cuenta Premium
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 border border-gray-700 hover:border-cyan-500 text-sm text-gray-300 hover:text-cyan-400 rounded-xl transition-colors">
              <Edit3 size={14} />
              Editar Perfil
            </button>
          </div>

          {/* Info chips */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Mail size={15} className="text-cyan-400 flex-shrink-0" />
              <span className="truncate">miguel.gonzalez@mototech.co</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin size={15} className="text-purple-400 flex-shrink-0" />
              Bogotá, Colombia
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone size={15} className="text-green-400 flex-shrink-0" />
              +57 310 123 4567
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar size={15} className="text-orange-400 flex-shrink-0" />
              Miembro desde Enero 2020
            </div>
          </div>
        </div>
      </div>

      {/* Personal info form */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">
          Información Personal
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={form.nombre}
              onChange={handleChange("nombre")}
            />
          </div>
          <div>
            <label className={labelClass}>Apellido</label>
            <input
              className={inputClass}
              value={form.apellido}
              onChange={handleChange("apellido")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input
              className={inputClass}
              value={form.telefono}
              onChange={handleChange("telefono")}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha de Nacimiento</label>
            <input
              className={inputClass}
              value={form.fechaNacimiento}
              onChange={handleChange("fechaNacimiento")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Dirección</label>
            <input
              className={inputClass}
              value={form.direccion}
              onChange={handleChange("direccion")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Biografía</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.biografia}
              onChange={handleChange("biografia")}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">{s.label}</p>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className={`text-xs ${s.badgeColor}`}>{s.badge}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-4">
        <button className="px-5 py-2 border border-gray-700 text-sm text-gray-300 rounded-xl hover:border-gray-500 hover:text-white transition-colors">
          Cancelar
        </button>
        <button className="px-5 py-2 bg-gray-900 border border-gray-600 text-sm text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
