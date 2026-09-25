'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (!currentUser) {
        router.push('/signin');
      } else {
        fetchProducts(currentUser.email);
        fetchOrders(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async (email) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(data.filter((p) => p.vendor === email));
  };

  const fetchOrders = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/vendor/${encodeURIComponent(email)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleStatusChange = async (orderId, status) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
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
      <main className="px-6 py-12 max-w-3xl mx-auto pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2 text-center">
          Seller Dashboard
        </h1>
        <p className="text-sm text-zinc-500 text-center mb-8">{user?.email}</p>

        <div className="flex gap-2 justify-center mb-8">
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === 'products' ? 'bg-red-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            My Products ({products.length})
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === 'orders' ? 'bg-red-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {tab === 'products' ? (
          products.length === 0 ? (
            <p className="text-center text-zinc-500">
              You haven't listed any products yet. <a href="/sell" className="text-red-600">Sell something</a>
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-black dark:text-zinc-50">{product.name}</p>
                    <p className="text-sm text-zinc-500">GHS {product.price}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        ) : orders.length === 0 ? (
          <p className="text-center text-zinc-500">No orders yet for your products.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const myItems = order.items.filter((item) => item.vendor === user.email);
              return (
                <div
                  key={order.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs border border-zinc-300 dark:border-zinc-700 rounded-full px-2 py-1 bg-white dark:bg-zinc-900"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {myItems.map((item, i) => (
                    <p key={i} className="text-sm text-zinc-600 dark:text-zinc-300">
                      {item.name} × {item.qty} — GHS {item.price * item.qty}
                    </p>
                  ))}
                  <p className="text-xs text-zinc-500 mt-2">
                    Buyer: {order.buyerEmail} · {order.phone}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}