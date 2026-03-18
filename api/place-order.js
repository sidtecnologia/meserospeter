import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const supabaseUrl = process.env.SUPA_URL;
  const supabaseServiceRoleKey = process.env.SUPA_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'Faltan claves' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { orderDetails, products: currentProducts } = req.body;

    if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const updates = orderDetails.items.map(item => {
        const product = currentProducts.find(p => p.id === item.id);
        if (!product) throw new Error(`Producto ${item.id} no encontrado`);
        if (product.stock < item.qty) throw new Error(`Stock insuficiente para ${product.name}`);
        
        const newStock = product.stock - item.qty;
        return supabase.from('products').update({ stock: newStock }).eq('id', item.id).select(); 
    });

    const updateResults = await Promise.all(updates);
    for (const result of updateResults) {
        if (result.error) throw new Error(result.error.message);
    }

    const orderData = {
        customer_name: orderDetails.name,
        customer_address: orderDetails.address,
        payment_method: orderDetails.payment,
        total_amount: orderDetails.total,
        order_items: orderDetails.items,
        order_status: 'Pendiente'
    };

    const { error: orderError } = await supabase.from('orders').insert([orderData]);
    if (orderError) throw new Error(orderError.message);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};