import React, { useState } from 'react';
import { X, User, MapPin, ShoppingBag, Utensils } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onFinalize }) {
  const [name, setName] = useState('');
  const [table, setTable] = useState('');
  const [isTakeAway, setIsTakeAway] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinalize({ 
      name, 
      table: isTakeAway ? 'PARA LLEVAR' : table 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary p-8 text-white flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Cerrar Pedido</h2>
          <button onClick={onClose}><X size={32}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex gap-3 p-2 bg-gray-100 rounded-[2rem]">
            <button 
              type="button"
              onClick={() => setIsTakeAway(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-xs transition-all ${!isTakeAway ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
            >
              <Utensils size={18}/> En Sitio
            </button>
            <button 
              type="button"
              onClick={() => setIsTakeAway(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase text-xs transition-all ${isTakeAway ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
            >
              <ShoppingBag size={18}/> Para Llevar
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Identificación del Pedido</label>
              <div className="relative">
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-14 focus:border-primary focus:outline-none font-bold text-lg"
                  placeholder="Nombre Cliente / Mesero"
                />
                <User className="absolute left-5 top-5 text-gray-300" size={24}/>
              </div>
            </div>
            
            {!isTakeAway && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">Mesa Correspondiente</label>
                <div className="relative">
                  <input 
                    type="text" required value={table} onChange={e => setTable(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-14 focus:border-primary focus:outline-none font-bold text-lg"
                    placeholder="Ej: Mesa 15"
                  />
                  <MapPin className="absolute left-5 top-5 text-gray-300" size={24}/>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-green-200 active:scale-95 transition-all uppercase italic mt-4"
          >
            Enviar a Cocina
          </button>
        </form>
      </div>
    </div>
  );
}