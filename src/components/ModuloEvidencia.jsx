import React, { useState, useRef } from 'react';
import { Camera, Send, Trash2, Image as ImageIcon, MessageSquare } from 'lucide-react';

export const ModuloEvidencia = ({ vehiculoId }) => {
  // --- ESTADOS DEL CHAT ---
  const [mensajes, setMensajes] = useState([
    { id: 1, texto: 'Vehículo ingresado al taller. Iniciando revisión.', sender: 'Taller', hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  // --- ESTADOS DE FOTOGRAFÍAS ---
  const [fotos, setFotos] = useState([]);
  const fileInputRef = useRef(null);

  // --- FUNCIONES DEL CHAT ---
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const msj = {
      id: Date.now(),
      texto: nuevoMensaje,
      sender: 'Mecánico', // Aquí luego puedes dinamizar el usuario activo
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes((prev) => [...prev, msj]);
    setNuevoMensaje('');
  };

  // --- FUNCIONES DE FOTOGRAFÍAS ---
  const manejarSubidaFotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Crear URLs temporales para previsualizar las imágenes
    const nuevasFotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file)
    }));

    setFotos((prev) => [...prev, ...nuevasFotos]);
  };

  const eliminarFoto = (id) => {
    setFotos((prev) => prev.filter((foto) => foto.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* --- COLUMNA 1: EVIDENCIA FOTOGRÁFICA --- */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Camera size={20} />
            </div>
            <h3 className="text-xl font-black text-white">Evidencia Fotográfica</h3>
          </div>
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sm font-bold text-white px-4 py-2 rounded-xl transition-colors"
          >
            <ImageIcon size={16} /> Subir Fotos
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={manejarSubidaFotos} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Galería de Fotos */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {fotos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl p-8">
              <Camera size={40} className="mb-3 opacity-50" />
              <p className="font-semibold">No hay fotografías aún</p>
              <p className="text-sm text-zinc-500 mt-1 text-center">Sube imágenes del estado de la moto al ingresar o de los repuestos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fotos.map((foto) => (
                <div key={foto.id} className="relative group aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                  <img src={foto.url} alt="Evidencia" className="w-full h-full object-cover" />
                  {/* Overlay para eliminar */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => eliminarFoto(foto.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar foto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- COLUMNA 2: CHAT / BITÁCORA --- */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col h-[500px] overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-center gap-3 shrink-0">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white leading-tight">Bitácora y Chat</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Comentarios e historial del servicio</p>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-900/30">
          {mensajes.map((msj) => (
            <div key={msj.id} className={`flex flex-col ${msj.sender === 'Taller' ? 'items-start' : 'items-end'}`}>
              <div className="flex items-baseline gap-2 mb-1 px-1">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{msj.sender}</span>
                <span className="text-[10px] text-zinc-600 font-medium">{msj.hora}</span>
              </div>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                msj.sender === 'Taller' 
                  ? 'bg-zinc-800 text-zinc-200 rounded-tl-sm' 
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                {msj.texto}
              </div>
            </div>
          ))}
        </div>

        {/* Input del Chat */}
        <form onSubmit={enviarMensaje} className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-2 shrink-0">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-blue-500/60 rounded-xl py-2.5 px-4 text-white placeholder:text-zinc-500 outline-none transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!nuevoMensaje.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-colors flex items-center justify-center shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
};