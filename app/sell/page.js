'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Sell() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (!currentUser) {
        router.push('/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          description,
          vendor: user.email,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');

      setSuccess(true);
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (checking) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2">
        List a New Product
      </h1>
      <p className="text-sm text-zinc-500 mb-6">Selling as {user?.email}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Price (GHS)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
          rows={3}
        />
        <input
          type="url"
          placeholder="Image URL (e.g. from imgur.com)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Product added successfully!</p>}

        <button
          type="submit"
          className="rounded-full bg-black text-white px-6 py-3 font-medium"
        >
          List Product
        </button>
      </form>
    </main>
  );
}