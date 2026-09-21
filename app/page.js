import Navbar from '@/components/Navbar';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const products = await res.json();

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Buy and Sell With Trusted Local Vendors
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-xl">
          One platform where vendors list their products and shoppers find what they need — all in one place.
        </p>
        <p className="mt-2 text-sm text-zinc-500">{products.length} product(s) currently listed</p>
        <div className="flex gap-4 mt-8">
          <a href="/browse" className="rounded-full bg-black text-white px-6 py-3 font-medium">
            Browse Products
          </a>
          <a href="/sell" className="rounded-full border border-black px-6 py-3 font-medium">
            Sell on Our Platform
          </a>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2">1</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">Create an Account</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Sign up as a shopper or vendor in seconds.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2">2</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">List or Browse Products</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Vendors upload products, shoppers explore them.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2">3</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">Buy and Sell</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Connect directly and complete the sale.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-8 mt-16 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; 2026 MarketPlace. All rights reserved.
        </p>
      </footer>
    </>
  );
}