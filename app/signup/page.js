'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-6">
        Create Your Account
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

               <button
          type="submit"
          className="rounded-full bg-black text-white px-6 py-3 font-medium"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}