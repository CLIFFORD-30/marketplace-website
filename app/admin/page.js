'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAIL = 'kyeremehclifford62@gmail.com';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState([]);
  const [general, setGeneral] = useState('');
  const [sales, setSales] = useState('');
  const [savingContacts, setSavingContacts] = useState(false);
  const [contactsSaved, setContactsSaved] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
  };

  const fetchContacts = async () => {
    const snap = await getDoc(doc(db, 'settings', 'contacts'));
    if (snap.exists()) {
      setGeneral(snap.data().general || '');
      setSales(snap.data().sales || '');
    } else {
      setGeneral('0507922264');
      setSales('0550959320');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);

      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        fetchProducts();
        fetchContacts();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSaveContacts = async (e) => {
    e.preventDefault();
    setSavingContacts(true);
    setContactsSaved(false);
    await setDoc(doc(db, 'settings', 'contacts'), { general, sales }, { merge: true });
    setSavingContacts(false);
    setContactsSaved(true);
    setTimeout(() => setContactsSaved(false), 2000);
  };

  if (checking || !user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
        Admin Dashboard
      </h1>

      <section className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-10">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-1">
          WhatsApp Contact Settings
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          These numbers power the floating WhatsApp button across the site. Changes apply immediately, no code needed.
        </p>
        <form onSubmit={handleSaveContacts} className="flex flex-col gap-3 max-w-sm">
          <div>
            <label className="text-xs text-zinc-500">General Support number</label>
            <input
              type="tel"
              value={general}
              onChange={(e) => setGeneral(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 mt-1 bg-white dark:bg-zinc-900"
              required
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Sales Support number</label>
            <input
              type="tel"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 mt-1 bg-white dark:bg-zinc-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={savingContacts}
            className="bg-red-600 text-white rounded-full py-2 text-sm font-medium disabled:opacity-50 mt-1"
          >
            {savingContacts ? 'Saving...' : contactsSaved ? 'Saved ✓' : 'Save Contacts'}
          </button>
        </form>
      </section>

      <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
        All Products
      </h2>
      {products.length === 0 ? (
        <p className="text-zinc-500">No products to manage.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-black dark:text-zinc-50">{product.name}</p>
                <p className="text-sm text-zinc-500">
                  Sold by {product.vendor} — GHS {product.price}
                </p>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}