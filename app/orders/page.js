'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

export default function Orders() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);
  const [reviewed, setReviewed] = useState([]);
  const [reviewing, setReviewing] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);

      if (!currentUser) {
        router.push('/signin');
      } else {
        fetchOrders(currentUser.email);
        fetchReviewed(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/buyer/${encodeURIComponent(email)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const fetchReviewed = async (email) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/buyer/${encodeURIComponent(email)}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    setReviewed(data.map((r) => `${r.orderId}_${r.productId}`));
  };

  const openReviewForm = (orderId, productId) => {
    setReviewing(`${orderId}_${productId}`);
    setRating(5);
    setComment('');
    setError('');
  };

  const submitReview = async (orderId, productId) => {
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, orderId, buyerEmail: user.email, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setReviewed([...reviewed, `${orderId}_${productId}`]);
      setReviewing(null);
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
    <>
      <Navbar />
      <main className="px-6 py-12 max-w-2xl mx-auto pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-500 mb-6">You haven't placed any orders yet.</p>
            <a href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                    {order.status}
                  </span>
                </div>
                {order.items.map((item, i) => {
                  const key = `${order.id}_${item.id}`;
                  const alreadyReviewed = reviewed.includes(key);
                  return (
                    <div key={i} className="mb-2">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        {item.name} × {item.qty} — GHS {item.price * item.qty}
                      </p>
                      {order.status === 'Delivered' && !alreadyReviewed && reviewing !== key && (
                        <button
                          onClick={() => openReviewForm(order.id, item.id)}
                          className="text-xs text-red-600 mt-1"
                        >
                          Write a Review
                        </button>
                      )}
                      {alreadyReviewed && (
                        <p className="text-xs text-green-600 mt-1">✓ Reviewed</p>
                      )}
                      {reviewing === key && (
                        <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setRating(n)}
                                className="text-xl"
                              >
                                {n <= rating ? '★' : '☆'}
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was the product?"
                            className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900"
                            rows={2}
                          />
                          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => submitReview(order.id, item.id)}
                              className="bg-red-600 text-white text-xs rounded-full px-4 py-2 font-medium"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => setReviewing(null)}
                              className="text-xs text-zinc-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <p className="font-semibold text-black dark:text-zinc-50 mt-3">
                  Total: GHS {order.total}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}