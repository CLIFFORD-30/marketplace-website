'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (!currentUser) {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      const vendorEmails = [...new Set(cart.map((item) => item.vendor))];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: user.email,
          vendorEmails,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            vendor: item.vendor,
          })),
          total: totalPrice,
          phone,
          address,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');

      clearCart();
      router.push('/orders');
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  if (checking) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Checking your account...</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <p className="text-zinc-500 mb-6">Your cart is empty.</p>
          <a href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
            Browse Products
          </a>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          Checkout
        </h1>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>{item.name} × {item.qty}</span>
              <span>GHS {item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <span>Total</span>
            <span>GHS {totalPrice}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-zinc-300 rounded-lg px-4 py-2"
            required
          />
          <textarea
            placeholder="Delivery address / meeting point"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-zinc-300 rounded-lg px-4 py-2"
            rows={3}
            required
          />

          <p className="text-xs text-zinc-500">
            Payment is arranged directly with the vendor (e.g. cash or mobile money on pickup/delivery).
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="bg-red-600 text-white rounded-full py-3 font-semibold disabled:opacity-50"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </main>
    </>
  );
}