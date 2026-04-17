import React from "react";
import { FileText, DollarSign, Calendar, User } from "lucide-react";

export const Facturas = () => {
  const facturas = [
    {
      numero: "FAC-001",
      cliente: "Carlos Ramírez",
      fecha: "10 Mar 2026",
      total: "$250.000",
      estado: "Pagada",
    },
    {
      numero: "FAC-002",
      cliente: "Laura Gómez",
      fecha: "12 Mar 2026",
      total: "$180.000",
      estado: "Pendiente",
    },
    {
      numero: "FAC-003",
      cliente: "Andrés Torres",
      fecha: "15 Mar 2026",
      total: "$320.000",
      estado: "Pagada",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-white">Facturas</h2>
        <p className="text-zinc-500 text-sm">
          Gestión y control de facturación del taller
        </p>
      </div>

      {/* LISTADO */}
      <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          {facturas.map((factura, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:border-purple-500/40 hover:shadow-md transition-all"
            >
              {/* INFO PRINCIPAL */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {factura.numero}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {factura.fecha}
                  </p>
                </div>
              </div>

              {/* CLIENTE */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User size={14} />
                {factura.cliente}
              </div>

              {/* VALOR */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <DollarSign size={14} />
                {factura.total}
              </div>

              {/* ESTADO */}
              <div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    factura.estado === "Pagada"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {factura.estado}
                </span>
              </div>

              {/* BOTÓN */}
              <div>
                <button className="bg-purple-600/10 text-purple-400 px-4 py-2 rounded-lg text-sm hover:bg-purple-600/20 transition">
                  Ver factura
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};