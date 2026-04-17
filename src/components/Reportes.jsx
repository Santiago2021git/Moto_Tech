import React from "react";
import { 
  DollarSign, Wrench, Users, Calendar, 
  TrendingUp, Download, FileText, CheckCircle2, Clock
} from "lucide-react";

export const Reportes = () => {
  // Datos para la gráfica de barras (Últimos 6 meses)
  const ingresosMensuales = [
    { mes: "Sep", valor: 4.2, height: "h-[60%]" },
    { mes: "Oct", valor: 5.1, height: "h-[75%]" },
    { mes: "Nov", valor: 4.8, height: "h-[70%]" },
    { mes: "Dic", valor: 6.0, height: "h-[85%]" },
    { mes: "Ene", valor: 5.5, height: "h-[80%]" },
    { mes: "Feb", valor: 6.8, height: "h-[100%]" },
  ];

  // Datos para la leyenda del gráfico circular
  const distribucion = [
    { label: "Mantenimiento", color: "bg-blue-500", porcentaje: "45%" },
    { label: "Reparación", color: "bg-purple-500", porcentaje: "30%" },
    { label: "Diagnóstico", color: "bg-green-500", porcentaje: "15%" },
    { label: "Modificación", color: "bg-orange-500", porcentaje: "10%" },
  ];

  // Datos del historial para renderizar la lista responsive
  const historialDocumentos = [
    {
      titulo: "Reporte mensual de ingresos",
      formato: "Formato PDF",
      fecha: "01/04/2026",
      categoria: "Ventas",
      estado: "Completado",
      estadoEstilo: "text-green-400 bg-green-500/10 border-green-500/20",
      EstadoIcon: CheckCircle2,
      accionActiva: true
    },
    {
      titulo: "Estado de stock general",
      formato: "Excel / CSV",
      fecha: "28/03/2026",
      categoria: "Inventario",
      estado: "Generando...",
      estadoEstilo: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      EstadoIcon: Clock,
      accionActiva: false
    }
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Reportes y Estadísticas</h2>
          <p className="text-zinc-500 mt-1 font-medium">Visualiza métricas clave del negocio y rendimiento general.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Ingresos */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-lg shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <DollarSign size={24} />
            </div>
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Este mes</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-blue-100 font-medium text-sm mb-1">Ingresos del Mes</h3>
            <p className="text-4xl font-black text-white">$6.8M</p>
            <div className="flex items-center gap-1 text-blue-200 mt-2 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+19.3% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Card 2: Servicios */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 shadow-lg shadow-purple-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Wrench size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <Wrench size={24} />
            </div>
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Total</span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-purple-100 font-medium text-sm mb-1">Servicios Realizados</h3>
            <p className="text-4xl font-black text-white">135</p>
            <p className="text-purple-200 mt-2 text-xs font-semibold">Este mes</p>
          </div>
        </div>

        {/* Card 3: Clientes */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 shadow-lg shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <Users size={24} />
            </div>
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Activos</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-emerald-100 font-medium text-sm mb-1">Clientes Atendidos</h3>
            <p className="text-4xl font-black text-white">78</p>
            <p className="text-emerald-200 mt-2 text-xs font-semibold">Este mes</p>
          </div>
        </div>

        {/* Card 4: Tiempos */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-6 shadow-lg shadow-orange-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Calendar size={80} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <Calendar size={24} />
            </div>
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">Promedio</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-orange-100 font-medium text-sm mb-1">Días por Servicio</h3>
            <p className="text-4xl font-black text-white">2.8</p>
            <p className="text-orange-200 mt-2 text-xs font-semibold">Tiempo promedio</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        {/* Gráfica de Barras: Ingresos Mensuales */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col min-h-[350px]">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ingresos Mensuales</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8">Últimos 6 meses</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto pt-10 relative">
            {/* Líneas guía (Grid de fondo) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[8, 6, 4, 2, 0].map((val, i) => (
                <div key={i} className="flex items-center gap-4 w-full">
                  <span className="text-[10px] sm:text-xs text-zinc-600 font-mono w-6 text-right">${val}M</span>
                  <div className="flex-1 border-b border-zinc-800/50 border-dashed"></div>
                </div>
              ))}
            </div>

            {/* Barras */}
            <div className="relative z-10 flex items-end justify-between w-full pl-10 h-48 sm:h-64">
              {ingresosMensuales.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 w-1/6">
                  <div className={`w-full max-w-[24px] sm:max-w-[40px] bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-lg sm:rounded-t-xl hover:from-blue-600 hover:to-blue-300 transition-colors ${item.height} relative group`}>
                    {/* Tooltip Hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      ${item.valor}M
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-500">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico Circular: Servicios por Tipo */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Servicios por Tipo</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8">Distribución de trabajos</p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-auto py-4">
            {/* Gráfico CSS (Conic Gradient) */}
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] border-[6px] border-zinc-950 shrink-0"
              style={{
                background: `conic-gradient(
                  #3b82f6 0% 45%, 
                  #a855f7 45% 75%, 
                  #22c55e 75% 90%, 
                  #f97316 90% 100%
                )`
              }}
            ></div>

            {/* Leyenda */}
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              {distribucion.map((item, i) => (
                <div key={i} className="flex items-center justify-between sm:justify-start gap-4 p-3 sm:p-0 bg-zinc-900/50 sm:bg-transparent rounded-xl sm:rounded-none">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-md ${item.color} shadow-sm`}></div>
                    <p className="text-white text-sm font-bold">{item.label}</p>
                  </div>
                  <p className="text-zinc-400 font-mono text-sm sm:text-xs">{item.porcentaje}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HISTORIAL REDISEÑADO (Responsive List/Grid en lugar de Tabla) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 lg:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Historial de Documentos Generados</h3>
        
        <div className="flex flex-col gap-3">
          {/* Cabecera visual (Solo visible en Desktop) */}
          <div className="hidden md:flex items-center px-4 pb-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/80 mb-2">
            <div className="w-2/5">Documento</div>
            <div className="w-1/5">Fecha</div>
            <div className="w-1/5">Estado</div>
            <div className="w-1/5 text-right">Acción</div>
          </div>

          {/* Filas / Tarjetas */}
          {historialDocumentos.map((doc, index) => {
            const IconoEstado = doc.EstadoIcon;
            return (
              <div 
                key={index} 
                className="flex flex-col md:flex-row md:items-center bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 p-4 rounded-2xl transition-all gap-4 md:gap-0 group"
              >
                {/* Info Principal */}
                <div className="flex items-center gap-4 w-full md:w-2/5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm md:text-base">{doc.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-500">{doc.formato}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span className="text-xs font-bold text-zinc-400">{doc.categoria}</span>
                    </div>
                  </div>
                </div>

                {/* Contenedor secundario para alinear en móvil y desktop */}
                <div className="flex items-center justify-between w-full md:w-3/5 border-t border-zinc-800/50 md:border-none pt-4 md:pt-0">
                  
                  {/* Fecha */}
                  <div className="w-auto md:w-1/3 text-zinc-400 text-sm font-medium">
                    {doc.fecha}
                  </div>

                  {/* Estado */}
                  <div className="w-auto md:w-1/3 flex justify-start">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${doc.estadoEstilo}`}>
                      <IconoEstado size={14} /> {doc.estado}
                    </span>
                  </div>

                  {/* Acción */}
                  <div className="w-auto md:w-1/3 flex justify-end">
                    <button 
                      className={`text-sm font-bold transition-colors ${
                        doc.accionActiva 
                          ? 'text-blue-500 hover:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl' 
                          : 'text-zinc-600 cursor-not-allowed px-4 py-2'
                      }`}
                      disabled={!doc.accionActiva}
                    >
                      Descargar
                    </button>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};