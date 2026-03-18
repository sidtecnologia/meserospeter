import React from 'react';
import { money } from '../lib/utils';

export default function ProductCard({ product, onAdd, onClickImage }) {
  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}>
      {product.bestSeller && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md z-10">
          Top Ventas
        </div>
      )}
      
      <div className="relative h-40 w-full bg-gray-100 cursor-pointer" onClick={() => onClickImage(product)}>
        <img 
          src={product.image[0]} 
          alt={product.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
            Agotado
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="font-semibold text-gray-800 leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-bold text-lg">${money(product.price)}</span>
          <button 
            disabled={isOutOfStock}
            onClick={() => onAdd(product, 1)}
            className="bg-primary hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}