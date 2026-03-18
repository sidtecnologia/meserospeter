import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ProductOptionsModal({ isOpen, onClose, product, onConfirm }) {
  const [note, setNote] = useState('');

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onConfirm(product, note);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Personalizar Pedido</span>
            <h3 className="font-black text-xl text-gray-900 leading-tight uppercase">{product.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-200 text-gray-500 rounded-full"><X size={20}/></button>
        </div>
        
        <div className="p-6">
          <label className="flex items-center gap-2 text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">
            <MessageSquare size={16} className="text-primary"/> Notas del Cliente
          </label>
          <textarea
            autoFocus
            className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-primary focus:outline-none bg-gray-50 resize-none h-32 text-gray-800 font-medium"
            placeholder="Sin cebolla, muy caliente, agregar cubiertos..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          
          <div className="mt-8 flex gap-3">
            <button onClick={handleAdd} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg uppercase italic">
              <CheckCircle2 size={24}/> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}