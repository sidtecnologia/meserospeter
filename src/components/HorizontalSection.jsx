import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function HorizontalSection({ title, products, onAdd }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white rounded-full shadow-sm border"><ChevronLeft size={20}/></button>
          <button onClick={() => scroll('right')} className="p-2 bg-white rounded-full shadow-sm border"><ChevronRight size={20}/></button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 no-scrollbar snap-x pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map(p => (
          <div key={p.id} className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px] snap-start">
            <ProductCard product={p} onAdd={onAdd} onClickImage={() => {}} />
          </div>
        ))}
      </div>
    </section>
  );
}