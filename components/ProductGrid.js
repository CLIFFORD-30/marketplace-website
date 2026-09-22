'use client';

import { useState } from 'react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Other'];

export default function ProductGrid({ products }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="relative max-w-md mx-auto mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-zinc-300 dark:border-zinc-700 rounded-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex gap-2 justify-center flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500">
          {products.length === 0
            ? 'No products listed yet. Be the first to sell something!'
            : 'No products match your filters.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
                  No image
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                {product.category && (
                  <span className="text-xs text-red-600 font-medium mb-1">{product.category}</span>
                )}
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {product.name}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Sold by {product.vendor}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 flex-1">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <p className="text-xl font-semibold text-black dark:text-zinc-50">
                    GHS {product.price}
                  </p>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <>
                      <p className="text-sm text-zinc-400 line-through">
                        GHS {product.oldPrice}
                      </p>
                      <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        -{Math.round(100 - (product.price / product.oldPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}