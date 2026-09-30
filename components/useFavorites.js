'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export function useFavorites() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      const snap = await getDoc(doc(db, 'favorites', currentUser.uid));
      setFavorites(snap.exists() ? snap.data().productIds || [] : []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (productId) => {
    if (!user) return false;
    const isFav = favorites.includes(productId);
    const ref = doc(db, 'favorites', user.uid);
    if (isFav) {
      await setDoc(ref, { productIds: arrayRemove(productId) }, { merge: true });
      setFavorites((prev) => prev.filter((id) => id !== productId));
    } else {
      await setDoc(ref, { productIds: arrayUnion(productId) }, { merge: true });
      setFavorites((prev) => [...prev, productId]);
    }
    return true;
  };

  return { user, favorites, toggleFavorite, loading };
}