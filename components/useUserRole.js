'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const ADMIN_EMAIL = 'kyeremehclifford62@gmail.com';

export function useUserRole() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      if (currentUser.email === ADMIN_EMAIL) {
        setRole('admin');
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      setRole(snap.exists() ? snap.data().role : 'buyer');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, role, loading };
}