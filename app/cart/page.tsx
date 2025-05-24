'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link

const Cart = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Red Rose', color: 'Red', price: 2459000, oldPrice: 2809000, qty: 1, img: '/images/rose.jpeg' },
    { id: 2, name: 'Red Rose', color: 'Red', price: 2459000, oldPrice: 2809000, qty: 1, img: '/images/rose.jpeg' },
    { id: 3, name: 'Tulip Basket', color: 'Pink', price: 2799000, oldPrice: 3149000, qty: 1, img: '/images/tulip.jpeg' }
  ]);

  const handleQuantityChange = (id, change) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item));
  };

  const handleRemove = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 pt-40">
    
      <div className="border-b mb-4"></div>
      
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      
      {/* Flex container untuk produk dan bagian kanan */}
      <div className="flex justify-between gap-8">
        <div className="flex-1">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-4">
                <Image src={item.img} alt={item.name} width={80} height={80} className="rounded-none" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                  <button className="text-red-500 text-sm" onClick={() => handleRemove(item.id)}>REMOVE</button>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">Rp {item.price.toLocaleString()}</p>
                <p className="text-gray-400 line-through">Rp {item.oldPrice.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button className="px-2 py-1 border" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bagian kanan dengan subtotal, checkout, dan special message */}
        <div className="w-1/3">
          <div className="flex flex-col items-end space-y-4">
            <div>
              <p className="text-lg font-semibold">SUBTOTAL</p>
    <p className="text-xl font-bold">Rp {subtotal.toLocaleString()}</p>
            </div>

            {/* Checkout button */}
            <Link href="/checkout">
              <button className="bg-dusty text-white px-32 py-3 w-full mt-6">Check Out</button>
            </Link>
            
            {/* Special message */}
            <p className="text-sm text-gray-500 mt-2">Shipping, taxes, and discount codes are calculated at checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
