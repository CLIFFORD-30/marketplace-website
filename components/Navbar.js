'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img
          src="https://uenr.edu.gh/wp-content/uploads/2021/01/Artboard-1.png"
          alt="UENR logo"
          className="h-8 w-auto"
        />
        <span className="text-base sm:text-xl font-semibold tracking-tight text-black dark:text-zinc-50 whitespace-nowrap">
          UENR <span className="text-red-600">MARKET</span>
        </span>
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/cart" className="relative text-xl">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-zinc-600 dark:text-zinc-300 truncate max-w-[180px]">
              Welcome, {user.email}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="rounded-full border border-red-600 text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Sign In
            </Link>
            <Link href="/signup" className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}