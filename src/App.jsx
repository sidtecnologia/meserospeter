import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, UtensilsCrossed, Star, ListFilter } from 'lucide-react';
import { supabase } from './lib/supabase';
import ProductCard from './components/ProductCard';
import HorizontalSection from './components/HorizontalSection';
import CategoryNav from './components/CategoryNav';
import ProductOptionsModal from './components/ProductOptionsModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import { money } from './lib/utils';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('__all');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const featured = useMemo(() => products.filter(p => p.featured), [products]);
  const aderezos = useMemo(() => products.filter(p => p.category.toLowerCase().includes('aderezo')), [products]);
  const adicionales = useMemo(() => products.filter(p => p.category.toLowerCase().includes('adicional')), [products]);

  const filteredItems = useMemo(() => {
    if (search) return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== '__all') return products.filter(p => p.category === activeCategory);
    return [];
  }, [products, search, activeCategory]);

  const addToCartWithNote = (product, note) => {
    setCart(prev => [...prev, { ...product, note, qty: 1 }]);
  };

  const updateQty = (idx, delta) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[idx].qty += delta;
      return newCart[idx].qty <= 0 ? newCart.filter((_, i) => i !== idx) : newCart;
    });
  };

  const finalizeOrder = async (details) => {
    try {
      const isTable = details.table !== 'PARA LLEVAR';
      const orderTotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const tableId = details.table.replace(/\D/g, '');

      if (isTable) {
        const { data: session } = await supabase
          .from('table_sessions')
          .select('*')
          .eq('table_number', tableId)
          .eq('status', 'open')
          .maybeSingle();

        if (session) {
          await supabase
            .from('table_sessions')
            .update({
              items: [...(session.items || []), ...cart],
              total: Number(session.total || 0) + orderTotal,
              order_status: 'Pendiente'
            })
            .eq('id', session.id);
        } else {
          await supabase
            .from('table_sessions')
            .insert([{
              table_number: tableId,
              customer_name: details.name,
              items: cart,
              total: orderTotal,
              status: 'open',
              order_status: 'Pendiente'
            }]);
        }

        await supabase.from('orders').insert([{
          customer_name: details.name,
          customer_address: tableId,
          total_amount: orderTotal,
          order_items: cart,
          order_status: 'Pendiente'
        }]);
      } else {
        await supabase.from('orders').insert([{
          customer_name: details.name,
          customer_address: 'PARA LLEVAR',
          total_amount: orderTotal,
          order_items: cart,
          order_status: 'Pendiente'
        }]);
      }

      setSuccessMsg('¡PEDIDO ENVIADO!');
      setCart([]);
      setIsCheckoutOpen(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-primary animate-pulse italic uppercase tracking-tighter">Cargando Menú...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {successMsg && (
        <div className="fixed top-8 inset-x-8 bg-emerald-600 text-white p-6 rounded-[2rem] shadow-2xl z-[200] text-center font-black animate-bounce text-xl italic uppercase tracking-tighter">
          {successMsg}
        </div>
      )}

      <header className="bg-primary text-white sticky top-0 z-[40] px-6 py-8 rounded-b-[3.5rem] shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-black text-3xl tracking-tighter italic flex items-center gap-2">
              <UtensilsCrossed size={32}/> ComidaRápida
            </h1>
            <div className="bg-white/20 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-sm">Panel de Meseros</div>
          </div>
          <div className="relative">
            <input 
              type="text" placeholder="Buscar plato..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white pl-14 pr-6 py-5 rounded-[2rem] text-gray-900 font-black shadow-inner outline-none focus:ring-4 focus:ring-blue-400 transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-6 top-5 text-gray-400" size={28} />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-10">
        <CategoryNav categories={categories} activeCategory={activeCategory} onSelect={(c) => { setActiveCategory(c); setSearch(''); }} />

        {search || activeCategory !== '__all' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase italic text-gray-800">
              <ListFilter className="text-primary"/> {search ? `Resultados: ${search}` : activeCategory}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(p => <ProductCard key={p.id} product={p} onAdd={(p) => { setSelectedProduct(p); setIsOptionsOpen(true); }} onClickImage={() => {}} />)}
            </div>
          </section>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase italic text-gray-800">
                <Star className="text-yellow-400 fill-yellow-400" size={28}/> Recomendados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {featured.map(p => <ProductCard key={p.id} product={p} onAdd={(p) => { setSelectedProduct(p); setIsOptionsOpen(true); }} onClickImage={() => {}} />)}
              </div>
            </section>
            <HorizontalSection title="Aderezos y Salsas" products={aderezos} onAdd={(p) => { setSelectedProduct(p); setIsOptionsOpen(true); }} />
            <HorizontalSection title="Adicionales del Chef" products={adicionales} onAdd={(p) => { setSelectedProduct(p); setIsOptionsOpen(true); }} />
          </>
        )}
      </main>

      <button 
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-10 right-10 p-7 rounded-[2.5rem] shadow-2xl z-40 flex items-center gap-5 transition-all active:scale-90 ${cart.length > 0 ? 'bg-primary text-white scale-110' : 'bg-white text-gray-300 pointer-events-none opacity-0'}`}
      >
        <div className="relative">
          <ShoppingCart size={36} />
          {cart.length > 0 && <span className="absolute -top-4 -right-4 bg-red-500 text-white text-[12px] font-black w-8 h-8 flex items-center justify-center rounded-full ring-4 ring-primary">{cart.length}</span>}
        </div>
        {cart.length > 0 && <span className="font-black text-2xl italic tracking-tighter">${money(cart.reduce((a, b) => a + (b.price * b.qty), 0))}</span>}
      </button>

      <ProductOptionsModal isOpen={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} product={selectedProduct} onConfirm={addToCartWithNote} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQty={updateQty} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onFinalize={finalizeOrder} />
    </div>
  );
}