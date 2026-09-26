'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAIL = 'kyeremehclifford62@gmail.com';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const redirectByRole = (userEmail, userRole) => {
    if (userEmail === ADMIN_EMAIL) {
      router.push('/admin');
    } else if (userRole === 'seller') {
      router.push('/seller');
    } else {
      router.push('/orders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });
      redirectByRole(email, role);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(
        doc(db, 'users', result.user.uid),
        { email: result.user.email, role: 'buyer', createdAt: new Date().toISOString() },
        { merge: true }
      );
      redirectByRole(result.user.email, 'buyer');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-black px-6">
      <div className="flex items-center gap-2 mb-6">
        <img
          src="https://uenr.edu.gh/wp-content/uploads/2021/01/Artboard-1.png"
          alt="UENR logo"
          className="h-10 w-auto"
        />
        <span className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          UENR <span className="text-red-600">MARKET</span>
        </span>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-white text-center mb-6">Create Your Account</h1>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              role === 'buyer' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            I'm a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              role === 'seller' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            I'm a Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 text-white placeholder-zinc-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="bg-red-600 text-white rounded-lg py-3 font-semibold mt-2"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-zinc-800 rounded-lg py-3 font-medium mt-4"
        >
          <span>🔵</span> Sign up with Google
        </button>

        <p className="text-center text-zinc-400 text-sm mt-4">
          Already have an account? <a href="/signin" className="text-red-400">Sign in</a>
        </p>
      </div>
    </main>
  );
}