'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

export default function Orders() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);

      if (!currentUser) {
        router.push('/signin');
      } else {
        fetchOrders(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/buyer/${encodeURIComponent(email)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  if (checking) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Checking your account...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-2xl mx-auto pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-500 mb-6">You haven't placed any orders yet.</p>
            <a href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                    {order.status}
                  </span>
                </div>
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-zinc-600 dark:text-zinc-300">
                    {item.name} × {item.qty} — GHS {item.price * item.qty}
                  </p>
                ))}
                <p className="font-semibold text-black dark:text-zinc-50 mt-3">
                  Total: GHS {order.total}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}