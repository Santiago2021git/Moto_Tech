import React from "react";
import { MapPin, Phone, Mail, Clock, Wrench } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { usePageTitle } from "../../hooks/usePageTitle";

export const MiTaller = () => {
  usePageTitle("Mi taller");
  const { tallerActivo } = useAuth();

  if (!tallerActivo) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-transparent p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-3xl">
              {tallerActivo.logoEmoji || "🏍️"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{tallerActivo.nombre}</h1>
              <p className="text-sm text-gray-300">{tallerActivo.eslogan}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <InfoRow icon={<MapPin size={18} className="text-purple-400" />} label="Dirección" value={tallerActivo.direccion} />
          <InfoRow icon={<Phone size={18} className="text-purple-400" />} label="Teléfono" value={tallerActivo.telefono} />
          <InfoRow icon={<Mail size={18} className="text-purple-400" />} label="Correo" value={tallerActivo.email} />
          <InfoRow icon={<Clock size={18} className="text-purple-400" />} label="Horario de atención" value={tallerActivo.horario} />
          {tallerActivo.nit && (
            <InfoRow icon={<Wrench size={18} className="text-purple-400" />} label="NIT" value={tallerActivo.nit} />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center mt-4">
        Si necesitas ayuda urgente, comunícate directamente con tu taller.
      </p>
    </div>
  );
};

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-gray-950/40 border border-gray-800 rounded-xl px-4 py-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
