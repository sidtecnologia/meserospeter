import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBasket } from 'lucide-react';
import { money } from '../lib/utils';

export default function CartModal({ isOpen, onClose, cart, updateQty, onCheckout }) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] flex flex-col max-h-[90vh] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-8 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
              <ShoppingBasket size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Comanda</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={28}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-black text-xl uppercase italic">Vaciío</div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 uppercase text-base leading-none">{item.name}</h4>
                    <span className="text-primary font-bold text-sm block mt-2 tracking-widest">${money(item.price)}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl border-2 border-white shadow-sm">
                    <button onClick={() => updateQty(idx, -1)} className="p-1 text-gray-400 hover:text-red-500">
                      {item.qty === 1 ? <Trash2 size={20}/> : <Minus size={20}/>}
                    </button>
                    <span className="font-black text-gray-900 text-lg w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="p-1 text-primary"><Plus size={20}/></button>
                  </div>
                </div>
                {item.note && (
                  <div className="bg-blue-50/50 p-4 rounded-2xl border-l-4 border-primary">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-tight leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t bg-gray-50 rounded-b-[3rem]">
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Total Orden</span>
            <span className="text-4xl font-black text-gray-900 italic">${money(total)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="w-full bg-primary disabled:bg-gray-200 text-white font-black py-6 rounded-3xl text-xl shadow-2xl shadow-blue-200 active:scale-95 transition-all uppercase italic tracking-tighter"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}