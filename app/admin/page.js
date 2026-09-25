'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ADMIN_EMAIL = 'kyeremehclifford62@gmail.com';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);

      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p.id !== id));
  };

  if (checking || !user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
        Admin Dashboard
      </h1>

      {products.length === 0 ? (
        <p className="text-zinc-500">No products to manage.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-black dark:text-zinc-50">{product.name}</p>
                <p className="text-sm text-zinc-500">
                  Sold by {product.vendor} — GHS {product.price}
                </p>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}