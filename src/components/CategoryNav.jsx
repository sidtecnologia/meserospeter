import React from 'react';
import { LayoutGrid, Pizza, Coffee, GlassWater, Beef, IceCream } from 'lucide-react';

const icons = {
  default: <LayoutGrid size={24}/>,
  bebidas: <GlassWater size={24}/>,
  comida: <Pizza size={24}/>,
  carnes: <Beef size={24}/>,
  postres: <IceCream size={24}/>,
  café: <Coffee size={24}/>
};

export default function CategoryNav({ categories, activeCategory, onSelect }) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Categorías del Menú</h2>
      <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
        <button
          onClick={() => onSelect('__all')}
          className={`flex flex-col items-center justify-center min-w-[100px] h-24 rounded-2xl transition-all shadow-sm border-2 ${activeCategory === '__all' ? 'bg-primary border-primary text-white scale-105' : 'bg-white border-transparent text-gray-500'}`}
        >
          <LayoutGrid size={28} />
          <span className="text-[10px] font-black uppercase mt-2">Todo</span>
        </button>
        {categories.filter(c => c !== '__all').map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex flex-col items-center justify-center min-w-[100px] h-24 rounded-2xl transition-all shadow-sm border-2 ${activeCategory === cat ? 'bg-primary border-primary text-white scale-105' : 'bg-white border-transparent text-gray-500'}`}
          >
            {icons[cat.toLowerCase()] || icons.default}
            <span className="text-[10px] font-black uppercase mt-2 truncate w-full px-2 text-center">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}