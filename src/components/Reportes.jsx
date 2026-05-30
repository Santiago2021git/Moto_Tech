import React, { useMemo } from "react";
import { 
  DollarSign, Wrench, Users, Calendar, 
  TrendingUp, Download, FileText, CheckCircle2, Clock
} from "lucide-react";
import { usePageTitle } from '../hooks/usePageTitle';
import jsPDF from "jspdf";
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';

export const Reportes = () => {
  usePageTitle("Reportes");

  const { vehiculos, clientes } = useApp();
  const { tallerActivo } = useAuth();
  const tallerId = tallerActivo?.id;
  const vehiculosTaller = vehiculos.filter(v => !v.tallerId || v.tallerId === tallerId);
  const clientesTaller = clientes.filter(c => !c.tallerId || c.tallerId === tallerId);

  const ingresosMensuales = useMemo(() => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const m = new Date().getMonth();
    const buckets = Array.from({ length: 6 }, (_, i) => {
      const idx = (m - 5 + i + 12) % 12;
      return { mes: meses[idx], idx, valor: 0 };
    });
    vehiculosTaller.forEach(v => {
      if (v.estado !== "Finalizada") return;
      const fecha = v.reporteEntrega?.fecha;
      if (!fecha) return;
      const d = new Date(fecha);
      const total = (v.serviciosCotizados || []).reduce((s, x) => s + Number(x.valor || x.precio || 0), 0);
      const b = buckets.find(x => x.idx === d.getMonth());
      if (b) b.valor += total;
    });
    const max = Math.max(...buckets.map(b => b.valor), 1);
    return buckets.map(b => ({
      mes: b.mes,
      valor: (b.valor / 1_000_000).toFixed(1),
      pct: Math.max(8, Math.round((b.valor / max) * 90)),
    }));
  }, [vehiculosTaller]);

  const distribucion = useMemo(() => {
    const palette = [
      { color: "bg-blue-500", hex: "#3b82f6" },
      { color: "bg-purple-500", hex: "#a855f7" },
      { color: "bg-green-500", hex: "#22c55e" },
      { color: "bg-orange-500", hex: "#f97316" },
    ];
    const tipos = {};
    vehiculosTaller.forEach(v => {
      (v.serviciosCotizados || []).forEach(s => {
        const k = s.item || s.titulo || s.nombre || s.tipo || "Otros";
        tipos[k] = (tipos[k] || 0) + 1;
      });
    });
    const total = Object.values(tipos).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(tipos).slice(0, 4).map(([label, count], i) => ({
      label,
      ...palette[i % palette.length],
      porcentaje: `${Math.round((count / total) * 100)}%`,
    }));
  }, [vehiculosTaller]);

  const finalizadosMes = vehiculosTaller.filter(v => v.estado === "Finalizada").length;

  const ingresosTotales = useMemo(() => vehiculosTaller
    .filter(v => v.estado === "Finalizada")
    .reduce((s, v) => s + (v.serviciosCotizados || []).reduce((a, x) => a + Number(x.valor || x.precio || 0), 0), 0),
    [vehiculosTaller]);

  const diasPromedio = useMemo(() => {
    const conFechas = vehiculosTaller.filter(v => v.estado === "Finalizada" && v.ingreso && v.reporteEntrega?.fecha);
    if (!conFechas.length) return "—";
    const total = conFechas.reduce((s, v) => {
      const d = (new Date(v.reporteEntrega.fecha) - new Date(v.ingreso)) / 86400000;
      return s + Math.max(0, d);
    }, 0);
    return (total / conFechas.length).toFixed(1);
  }, [vehiculosTaller]);

  const fmtMoney = (n) => n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(0)}K`
      : `$${n}`;

  const kpis = [
    { label: "Ingresos del Mes",     valor: fmtMoney(ingresosTotales), detalle: ingresosTotales ? "Servicios finalizados" : "Sin servicios finalizados" },
    { label: "Servicios Realizados", valor: String(finalizadosMes), detalle: "Finalizados a la fecha" },
    { label: "Clientes Atendidos",   valor: String(clientesTaller.length), detalle: "Total registrados" },
    { label: "Días por Servicio",    valor: String(diasPromedio),    detalle: "Tiempo promedio" },
  ];

  const historialDocumentos = [];

  // ─── EXPORTAR PDF ────────────────────────────────────────────────────────────
  const exportarPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const ancho = doc.internal.pageSize.getWidth();
    const margen = 18;
    let y = 0;

    // ── Encabezado con fondo oscuro
    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, ancho, 38, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MotoTech — Reporte de Estadísticas", margen, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(161, 161, 170);
    const fechaHoy = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
    doc.text(`Generado el ${fechaHoy}`, margen, 28);

    y = 48;

    // ── Sección: KPIs
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Indicadores Clave (KPIs)", margen, y);
    y += 6;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margen, y, ancho - margen, y);
    y += 6;

    const colores = [
      [37, 99, 235],   // blue
      [124, 58, 237],  // purple
      [5, 150, 105],   // emerald
      [234, 88, 12],   // orange
    ];

    const kpiAncho = (ancho - margen * 2 - 9) / 2;

    kpis.forEach((kpi, i) => {
      const col = i % 2;
      const fila = Math.floor(i / 2);
      const x = margen + col * (kpiAncho + 9);
      const yCard = y + fila * 28;
      const [r, g, b] = colores[i];

      doc.setFillColor(r, g, b);
      doc.roundedRect(x, yCard, kpiAncho, 22, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(kpi.label, x + 5, yCard + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(kpi.valor, x + 5, yCard + 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(220, 220, 220);
      doc.text(kpi.detalle, x + 5, yCard + 20);
    });

    y += Math.ceil(kpis.length / 2) * 28 + 10;

    // ── Sección: Gráfica de barras
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Ingresos Mensuales (últimos 6 meses)", margen, y);
    y += 6;

    doc.setDrawColor(226, 232, 240);
    doc.line(margen, y, ancho - margen, y);
    y += 6;

    const maxValor = Math.max(...ingresosMensuales.map(m => m.valor)) || 1;
    const alturaMaxBarra = 45;
    const anchoBarra = 16;
    const separacion = (ancho - margen * 2 - ingresosMensuales.length * anchoBarra) / (ingresosMensuales.length - 1);
    const baseY = y + alturaMaxBarra + 6;

    // Líneas guía
    [0, 2, 4, 6, 8].forEach(val => {
      const guiaY = baseY - (val / maxValor) * alturaMaxBarra;
      doc.setDrawColor(230, 230, 235);
      doc.setLineWidth(0.2);
      doc.line(margen + 8, guiaY, ancho - margen, guiaY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 160);
      doc.text(`$${val}M`, margen, guiaY + 1.5);
    });

    ingresosMensuales.forEach((item, i) => {
      const x = margen + 10 + i * (anchoBarra + separacion);
      const alturaBarra = (item.valor / maxValor) * alturaMaxBarra;
      const barraY = baseY - alturaBarra;

      // Barra con gradiente simulado (dos capas)
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(x, barraY, anchoBarra, alturaBarra, 2, 2, "F");
      doc.setFillColor(96, 165, 250);
      doc.roundedRect(x, barraY, anchoBarra, 4, 2, 2, "F");

      // Valor encima
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(30, 30, 30);
      doc.text(`$${item.valor}M`, x + anchoBarra / 2, barraY - 2, { align: "center" });

      // Mes abajo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 110);
      doc.text(item.mes, x + anchoBarra / 2, baseY + 6, { align: "center" });
    });

    y = baseY + 14;

    // ── Footer
    doc.setFillColor(9, 9, 11);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(0, pageHeight - 14, ancho, 14, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text("MotoTech © 2026 — Reporte generado automáticamente", margen, pageHeight - 5);
    doc.text(`Página 1`, ancho - margen, pageHeight - 5, { align: "right" });

    doc.save(`reporte_mototech_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // ─── EXPORTAR CSV ────────────────────────────────────────────────────────────
  const exportarCSV = () => {
    const sep = ",";
    const nl = "\n";
    const filas = [];

    // KPIs
    filas.push("=== INDICADORES CLAVE (KPIs) ===");
    filas.push(["Indicador", "Valor", "Detalle"].join(sep));
    kpis.forEach(k => filas.push([k.label, k.valor, k.detalle].join(sep)));
    filas.push("");

    // Ingresos mensuales
    filas.push("=== INGRESOS MENSUALES ===");
    filas.push(["Mes", "Ingresos (M COP)"].join(sep));
    ingresosMensuales.forEach(m => filas.push([m.mes, m.valor].join(sep)));
    filas.push("");

    // Distribución de servicios
    filas.push("=== DISTRIBUCION DE SERVICIOS POR TIPO ===");
    filas.push(["Tipo de Servicio", "Porcentaje"].join(sep));
    distribucion.forEach(d => filas.push([d.label, d.porcentaje].join(sep)));
    filas.push("");

    // Metadata
    filas.push("=== INFORMACION DEL REPORTE ===");
    filas.push(["Generado el", new Date().toLocaleString("es-CO")].join(sep));
    filas.push(["Empresa", "MotoTech"].join(sep));

    const csv = filas.join(nl);
    const bom = "\uFEFF"; // UTF-8 BOM para compatibilidad con Excel
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datos_mototech_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Reportes y Estadísticas</h2>
          <p className="text-zinc-500 mt-1 font-medium">Visualiza métricas clave del negocio y rendimiento general.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportarPDF}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
          >
            <Download size={18} />
            Exportar PDF
          </button>
          <button
            onClick={exportarCSV}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
          >
            <FileText size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <h3 className="text-blue-100 font-medium text-sm mb-1">{kpis[0].label}</h3>
            <p className="text-4xl font-black text-white">{kpis[0].valor}</p>
            <div className="flex items-center gap-1 text-blue-200 mt-2 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>{kpis[0].detalle}</span>
            </div>
          </div>
        </div>

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
            <h3 className="text-purple-100 font-medium text-sm mb-1">{kpis[1].label}</h3>
            <p className="text-4xl font-black text-white">{kpis[1].valor}</p>
            <p className="text-purple-200 mt-2 text-xs font-semibold">{kpis[1].detalle}</p>
          </div>
        </div>

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
            <h3 className="text-emerald-100 font-medium text-sm mb-1">{kpis[2].label}</h3>
            <p className="text-4xl font-black text-white">{kpis[2].valor}</p>
            <p className="text-emerald-200 mt-2 text-xs font-semibold">{kpis[2].detalle}</p>
          </div>
        </div>

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
            <h3 className="text-orange-100 font-medium text-sm mb-1">{kpis[3].label}</h3>
            <p className="text-4xl font-black text-white">{kpis[3].valor}</p>
            <p className="text-orange-200 mt-2 text-xs font-semibold">{kpis[3].detalle}</p>
          </div>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col min-h-[350px]">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ingresos Mensuales</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8">Últimos 6 meses</p>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto pt-10 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[8, 6, 4, 2, 0].map((val, i) => (
                <div key={i} className="flex items-center gap-4 w-full">
                  <span className="text-[10px] sm:text-xs text-zinc-600 font-mono w-6 text-right">${val}M</span>
                  <div className="flex-1 border-b border-zinc-800/50 border-dashed"></div>
                </div>
              ))}
            </div>
            <div className="relative z-10 flex items-end justify-between w-full pl-10 h-48 sm:h-64">
              {ingresosMensuales.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 w-1/6">
                  <div
                    style={{ height: `${item.pct}%` }}
                    className="w-full max-w-[24px] sm:max-w-[40px] bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-lg sm:rounded-t-xl hover:from-blue-600 hover:to-blue-300 transition-colors relative group"
                  >
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

        <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-xl flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Servicios por Tipo</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8">Distribución de trabajos</p>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-auto py-4">
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

      {/* HISTORIAL */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-6 lg:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Historial de Documentos Generados</h3>
        <div className="flex flex-col gap-3">
          <div className="hidden md:flex items-center px-4 pb-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/80 mb-2">
            <div className="w-2/5">Documento</div>
            <div className="w-1/5">Fecha</div>
            <div className="w-1/5">Estado</div>
            <div className="w-1/5 text-right">Acción</div>
          </div>
          {historialDocumentos.map((doc, index) => {
            const IconoEstado = doc.EstadoIcon;
            return (
              <div 
                key={index} 
                className="flex flex-col md:flex-row md:items-center bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 p-4 rounded-2xl transition-all gap-4 md:gap-0 group"
              >
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
                <div className="flex items-center justify-between w-full md:w-3/5 border-t border-zinc-800/50 md:border-none pt-4 md:pt-0">
                  <div className="w-auto md:w-1/3 text-zinc-400 text-sm font-medium">{doc.fecha}</div>
                  <div className="w-auto md:w-1/3 flex justify-start">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${doc.estadoEstilo}`}>
                      <IconoEstado size={14} /> {doc.estado}
                    </span>
                  </div>
                  <div className="w-auto md:w-1/3 flex justify-end">
                    <button 
                      onClick={doc.accionActiva ? exportarPDF : undefined}
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