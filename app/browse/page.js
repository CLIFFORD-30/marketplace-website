import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ProductGrid from '@/components/ProductGrid';

export default async function Browse() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
  const products = await res.json();

  return (
    <>
      <Navbar />

      <main className="px-6 py-12 max-w-5xl mx-auto pb-20">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          Browse Products
        </h1>

        <ProductGrid products={products} />
      </main>

      <BottomNav />
    </>
  );
}