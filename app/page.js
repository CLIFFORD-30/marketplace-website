import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import PromoBanner from '@/components/PromoBanner';
import HeroActions from '@/components/HeroActions';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const products = await res.json();

  return (
    <>
      <Navbar />

      <div
        className="relative flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1684695749267-233af13276d0?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Buy and Sell With Trusted K.K.C Vendors
        </h1>
        <p className="mt-4 text-lg text-white/90 max-w-xl">
          One platform where vendors list their products and shoppers find what they need — all in one place.
        </p>
        <p className="mt-2 text-sm text-white/70">{products.length} product(s) currently listed</p>
        <HeroActions />
      </div>

      <PromoBanner />

      <main className="flex flex-col items-center justify-center text-center px-6 pb-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2 text-red-600">1</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">Create an Account</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Sign up as a shopper or vendor in seconds.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2 text-red-600">2</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">List or Browse Products</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Vendors upload products, shoppers explore them.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold mb-2 text-red-600">3</div>
            <h3 className="font-semibold text-black dark:text-zinc-50">Buy and Sell</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Connect directly and complete the sale.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-8 mb-16 md:mb-0 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; 2026 MarketPlace. All rights reserved.
        </p>
      </footer>

      <BottomNav />
    </>
  );
}