import Navbar from '@/components/Navbar';

export default async function Browse() {
  const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' });
  const products = await res.json();

  return (
    <>
      <Navbar />

      <main className="px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8 text-center">
          Browse Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-zinc-500">
            No products listed yet. Be the first to sell something!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
                    No image
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                    {product.name}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Sold by {product.vendor}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 flex-1">
                    {product.description}
                  </p>
                  <p className="text-xl font-semibold text-black dark:text-zinc-50 mt-4">
                    GHS {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}