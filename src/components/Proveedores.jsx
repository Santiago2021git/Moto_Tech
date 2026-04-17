import React from "react";
import { 
  Plus, Search, Building2, Star, Phone, Mail, 
  Package, ShoppingCart, ChevronDown, Edit2, TrendingUp 
} from "lucide-react";

export const Proveedores = () => {
  // Datos ampliados basados en el diseño de referencia
  const proveedores = [
    {
      nombre: "Motul Colombia",
      categoria: "Lubricantes",
      rating: 4.8,
      telefono: "+57 601 234 5678",
      email: "ventas@motul.co",
      productos: ["Aceites", "Lubricantes", "Aditivos"],
      totalOrdenes: 145,
      ultimaOrden: "19 feb",
      avatarColor: "from-blue-600 to-indigo-600",
      estado: "Activo"
    },
    {
      nombre: "K&N Distribuciones",
      categoria: "Filtros",
      rating: 4.6,
      telefono: "+57 604 567 8901",
      email: "info@kndist.com",
      productos: ["Filtros de Aceite", "Filtros de Aire", "Filtros de Combustible"],
      totalOrdenes: 98,
      ultimaOrden: "17 feb",
      avatarColor: "from-purple-600 to-pink-600",
      estado: "Activo"
    },
    {
      nombre: "MotoParts S.A",
      categoria: "Repuestos",
      rating: 4.9,
      telefono: "+57 300 123 4567",
      email: "carlos@motoparts.com",
      productos: ["Frenos", "Cadenas", "Bujías"],
      totalOrdenes: 210,
      ultimaOrden: "20 feb",
      avatarColor: "from-emerald-500 to-teal-600",
      estado: "Activo"
    },
    {
      nombre: "LlantaSur",
      categoria: "Llantas",
      rating: 4.2,
      telefono: "+57 311 987 6543",
      email: "pedidos@llantasur.com",
      productos: ["Llantas Deportivas", "Neumáticos", "Parches"],
      totalOrdenes: 30,
      ultimaOrden: "05 ene",
      avatarColor: "from-orange-500 to-red-600",
      estado: "Inactivo"
    }
  ];

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Gestión de Proveedores</h2>
          <p className="text-zinc-500 mt-1 font-medium">Administra proveedores, repuestos y órdenes de compra</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Nuevo Proveedor
        </button>
      </div>

      {/* KPI CARDS (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">5</p>
            <p className="text-zinc-500 text-sm font-medium">Total Proveedores</p>
          </div>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">5</p>
            <p className="text-zinc-500 text-sm font-medium">Proveedores Activos</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">483</p>
            <p className="text-zinc-500 text-sm font-medium">Total Órdenes</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
            <Star size={28} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">4.8</p>
            <p className="text-zinc-500 text-sm font-medium">Rating Promedio</p>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o contacto..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todas las categorías</option>
            <option>Lubricantes</option>
            <option>Filtros</option>
            <option>Repuestos Generales</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GRID DE PROVEEDORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {proveedores.map((prov, i) => (
          <div 
            key={i} 
            className={`bg-zinc-950 border ${prov.estado === 'Inactivo' ? 'border-zinc-800/50 opacity-75' : 'border-zinc-800 hover:border-purple-500/30'} rounded-[2rem] p-6 hover:shadow-xl hover:shadow-purple-900/10 transition-all flex flex-col group`}
          >
            {/* HEADER TARJETA */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prov.avatarColor} flex items-center justify-center text-white font-black shadow-inner`}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                    {prov.nombre}
                  </h3>
                  <span className="inline-block mt-1 bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded-md font-medium border border-zinc-800">
                    {prov.categoria}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white font-bold text-sm">{prov.rating}</span>
              </div>
            </div>

            {/* CONTACTO */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone size={16} className="text-zinc-500" />
                <span className="text-sm">{prov.telefono}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail size={16} className="text-zinc-500" />
                <span className="text-sm">{prov.email}</span>
              </div>
            </div>

            {/* PRODUCTOS PRINCIPALES */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-zinc-500" />
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Productos</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {prov.productos.map((prod, index) => (
                  <span key={index} className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-lg font-medium border border-purple-500/20">
                    {prod}
                  </span>
                ))}
              </div>
            </div>

            {/* MÉTRICAS DE ÓRDENES */}
            <div className="flex justify-between items-center mb-6 mt-auto bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Total Órdenes</p>
                <p className="text-xl font-black text-white">{prov.totalOrdenes}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Última Orden</p>
                <p className="text-sm font-bold text-white">{prov.ultimaOrden}</p>
              </div>
            </div>

            {/* FOOTER (Botones de Acción) */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800">
                Ver Detalles
              </button>
              <button className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Nueva Orden
              </button>
              <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white p-2.5 rounded-xl transition-colors border border-zinc-800">
                <Edit2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};