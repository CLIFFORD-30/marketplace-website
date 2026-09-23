'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <a href="/" className="flex items-center gap-2">
        <img
          src="https://uenr.edu.gh/wp-content/uploads/2021/01/Artboard-1.png"
          alt="UENR logo"
          className="h-9 w-auto"
        />
        <span className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          UENR <span className="text-red-600">MARKET</span>
        </span>
      </a>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Welcome, {user.email}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="rounded-full border border-red-600 text-red-600 px-4 py-2 text-sm font-medium"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <a href="/signin" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Sign In
            </a>
            <a href="/signup" className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium">
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
}