import React from "react";
import { Link } from "react-router-dom";
import { Bike, Calendar, User as UserIcon, ChevronRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getMotosByCliente } from "../../data/clientes";
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

export const ClienteDashboard = () => {
  usePageTitle("Mis motos");
  const { user } = useAuth();
  const motos = getMotosByCliente(user?.id);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Hola, {user?.nombre?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Este es el estado actual de tus motos en el taller.
        </p>
      </div>

      {motos.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-10 text-center">
          <Bike size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-300 font-medium">Aún no tienes motos registradas</p>
          <p className="text-sm text-gray-500 mt-1">
            Cuando lleves tu moto al taller, aparecerá aquí su estado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motos.map((moto) => (
            <Link
              key={moto.id}
              to={`/cliente/moto/${moto.id}`}
              className="bg-gray-900/60 border border-gray-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Bike size={22} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {moto.marca} {moto.modelo}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {moto.placa} · {moto.año} · {moto.color}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                    estadoStyle[moto.estado]
                  }`}
                >
                  {estadoIcon[moto.estado]} {moto.estado}
                </span>
                <span className="text-xs text-gray-500">{moto.ordenServicio}</span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Avance</span>
                  <span>{moto.avance}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${moto.avance}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-800">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> Entrega: {moto.entregaEstimada}
                </span>
                <span className="flex items-center gap-1.5">
                  <UserIcon size={12} /> {moto.tecnico}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
