'use client';

import Link from 'next/link';
import { useUserRole } from '@/components/useUserRole';

export default function HeroActions() {
  const { role, loading } = useUserRole();

  if (loading) return null;

  return (
    <div className="flex gap-4 mt-8">
      <Link href="/browse" className="rounded-full bg-red-600 text-white px-6 py-3 font-medium">
        Browse Products
      </Link>
      {role !== 'buyer' && (
        <Link href="/sell" className="rounded-full border border-white text-white px-6 py-3 font-medium">
          Sell on Our Platform
        </Link>
      )}
    </div>
  );
}