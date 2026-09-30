'use client';

import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center py-2 md:hidden z-50">
      <Link href="/" className="flex flex-col items-center text-xs text-red-600 font-medium">
        <span className="text-xl">🏠</span>
        Home
      </Link>
      <Link href="/browse" className="flex flex-col items-center text-xs text-zinc-500">
        <span className="text-xl">🔍</span>
        Browse
      </Link>
      <Link href="/favorites" className="flex flex-col items-center text-xs text-zinc-500">
        <span className="text-xl">❤️</span>
        Favorites
      </Link>
      <Link href="/sell" className="flex flex-col items-center text-xs text-zinc-500">
        <span className="text-xl">➕</span>
        Sell
      </Link>
      <Link href="/signin" className="flex flex-col items-center text-xs text-zinc-500">
        <span className="text-xl">👤</span>
        Account
      </Link>
    </nav>
  );
}