'use client';

import Navbar from '@/components/Navbar';
import { useCart } from '@/components/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();

  return (
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-3xl mx-auto pb-24">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-500 mb-6">Your cart is empty.</p>
            <a href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
              Browse Products
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 text-xs">
                      No image
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-black dark:text-zinc-50">{item.name}</p>
                    <p className="text-sm text-zinc-500">GHS {item.price} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black dark:text-zinc-50">
                      GHS {item.price * item.qty}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex items-center justify-between">
              <p className="text-lg font-semibold text-black dark:text-zinc-50">
                Total: GHS {totalPrice}
              </p>
              <a
                href="/checkout"
                className="rounded-full bg-red-600 text-white px-6 py-3 font-medium"
              >
                Checkout
              </a>
            </div>
          </>
        )}
      </main>
    </>
  );
}