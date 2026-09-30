'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useFavorites } from '@/components/useFavorites';
import { useCart } from '@/components/CartContext';

export default function Favorites() {
  const { user, favorites, toggleFavorite, loading } = useFavorites();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }
    if (favorites.length > 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => setProducts(data.filter((p) => favorites.includes(p.id))));
    } else {
      setProducts([]);
    }
  }, [loading, user, favorites, router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-4xl mx-auto pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          My Favorites
        </h1>

        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-500 mb-6">No favorites yet.</p>
            <a href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col"
              >
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center text-lg"
                >
                  ❤️
                </button>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
                    No image
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-black dark:text-zinc-50">{product.name}</h2>
                  <p className="text-sm text-zinc-500 mt-1">Sold by {product.vendor}</p>
                  <p className="text-xl font-semibold text-black dark:text-zinc-50 mt-3">
                    GHS {product.price}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 bg-red-600 text-white rounded-full py-2 text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}