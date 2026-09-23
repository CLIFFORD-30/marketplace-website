'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Signed in successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      alert('Signed in successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent — check your inbox.');
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
        <h1 className="text-xl font-semibold text-white text-center mb-6">Sign In</h1>

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
          {message && <p className="text-sm text-green-400">{message}</p>}

          <button
            type="submit"
            className="bg-red-600 text-white rounded-lg py-3 font-semibold mt-2"
          >
            Sign In
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-zinc-800 rounded-lg py-3 font-medium mt-4"
        >
          <span>🔵</span> Sign in with Google
        </button>

        <div className="text-center mt-4 flex flex-col gap-2">
          <button onClick={handleForgotPassword} className="text-red-400 text-sm">
            Forgot password?
          </button>
          <p className="text-zinc-400 text-sm">
            Don't have an account? <a href="/signup" className="text-red-400">Sign up</a>
          </p>
        </div>
      </div>
    </main>
  );
}