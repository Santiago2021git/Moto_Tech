import React from "react";
import { 
  Package, Plus, Search, AlertCircle, 
  Edit3, ChevronDown, MapPin, Tag, 
  TrendingDown, Layers, ShoppingCart
} from "lucide-react";

export const Inventario = () => {
  // Datos ampliados para coincidir con el diseño
  const items = [
    {
      nombre: "Aceite Motul 10W40",
      marca: "Motul Colombia",
      codigo: "ACE-001",
      categoria: "Lubricantes",
      stock: 24,
      minStock: 10,
      precio: "$15.000",
      ubicacion: "Estante A-1",
      color: "from-blue-600 to-indigo-600"
    },
    {
      nombre: "Filtro de Aceite K&N",
      marca: "K&N Distribuciones",
      codigo: "FIL-002",
      categoria: "Filtros",
      stock: 5,
      minStock: 8,
      precio: "$25.000",
      ubicacion: "Estante B-2",
      color: "from-purple-600 to-pink-600"
    },
    {
      nombre: "Cadena DID 520",
      marca: "DID Racing",
      codigo: "CAD-003",
      categoria: "Transmisión",
      stock: 2,
      minStock: 5,
      precio: "$120.000",
      ubicacion: "Estante C-3",
      color: "from-emerald-500 to-teal-600"
    },
    {
      nombre: "Bujía NGK Iridium",
      marca: "NGK",
      codigo: "BUJ-004",
      categoria: "Eléctrico",
      stock: 45,
      minStock: 15,
      precio: "$35.000",
      ubicacion: "Estante D-1",
      color: "from-orange-500 to-red-600"
    }
  ];

  // Filtramos automáticamente los items con stock bajo para la alerta
  const stockBajoItems = items.filter(item => item.stock < item.minStock);

  return (
    <div className="animate-in space-y-8 pb-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Inventario</h2>
          <p className="text-zinc-500 mt-1 font-medium">Gestiona el stock de partes y repuestos</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Agregar Repuesto
        </button>
      </div>

      {/* KPI CARDS (Métricas Rápidas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Layers size={16} />
            <p className="text-sm font-medium">Total Items</p>
          </div>
          <p className="text-3xl font-black text-white">{items.length}</p>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <TrendingDown size={16} />
            <p className="text-sm font-medium">Stock Bajo</p>
          </div>
          <p className="text-3xl font-black text-orange-500">{stockBajoItems.length}</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Tag size={16} />
            <p className="text-sm font-medium">Categorías</p>
          </div>
          <p className="text-3xl font-black text-white">4</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <ShoppingCart size={16} />
            <p className="text-sm font-medium">Valor Est.</p>
          </div>
          <p className="text-3xl font-black text-white">$4.5M</p>
        </div>
      </div>

      {/* ALERTA DE STOCK BAJO */}
      {stockBajoItems.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 flex gap-4 items-start shadow-lg shadow-orange-500/5">
          <AlertCircle className="text-orange-500 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-orange-500 font-bold text-lg mb-1">
              Atención: Stock Bajo ({stockBajoItems.length} items)
            </h3>
            <p className="text-orange-400/80 font-medium text-sm md:text-base">
              Los siguientes repuestos necesitan reabastecimiento: <span className="text-orange-300 font-bold">{stockBajoItems.map(i => i.nombre).join(', ')}</span>
            </p>
          </div>
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, código o marca..." 
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-3 pl-5 pr-12 text-white font-medium outline-none transition-all cursor-pointer shadow-sm">
            <option>Todas las categorías</option>
            <option>Lubricantes</option>
            <option>Filtros</option>
            <option>Transmisión</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GRID DE INVENTARIO (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item, i) => {
          const isLowStock = item.stock < item.minStock;
          
          return (
            <div 
              key={i} 
              className={`bg-zinc-950 border ${isLowStock ? 'border-orange-500/30 shadow-orange-900/10' : 'border-zinc-800 hover:border-purple-500/30'} rounded-[2rem] p-6 hover:shadow-xl transition-all flex flex-col relative group`}
            >
              {/* HEADER TARJETA */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {item.nombre}
                    </h3>
                    <p className="text-zinc-500 text-xs font-medium mb-1">{item.marca}</p>
                  </div>
                </div>
              </div>

              {/* TAGS E INFO MEDIA */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-md text-xs font-bold border border-zinc-800">
                  {item.codigo}
                </span>
                <span className="bg-zinc-900 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-medium border border-zinc-800">
                  {item.categoria}
                </span>
                <span className="flex items-center gap-1 text-zinc-500 text-xs px-2.5 py-1">
                  <MapPin size={12} />
                  {item.ubicacion}
                </span>
              </div>

              {/* STOCK Y PRECIO */}
              <div className="flex items-end justify-between mb-6 mt-auto bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Stock Actual</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${isLowStock ? 'text-orange-500' : 'text-white'}`}>
                      {item.stock}
                    </span>
                    <span className="text-zinc-600 text-xs font-bold">
                      / min {item.minStock}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">Precio Unit.</p>
                  <p className="text-xl font-bold text-white">{item.precio}</p>
                </div>
              </div>

              {/* FOOTER (Botones de Acción) */}
              <div className="flex items-center gap-3 pt-2">
                <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-zinc-800 flex justify-center items-center gap-2">
                  <Edit3 size={16} />
                  Editar
                </button>
                {isLowStock && (
                  <button className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 py-2.5 rounded-xl text-sm font-bold transition-colors border border-orange-500/20">
                    Reabastecer
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};