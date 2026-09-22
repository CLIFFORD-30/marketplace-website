export default function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl px-6 py-8 mx-6 mt-6 text-center">
      <h2 className="text-2xl font-bold">Support Local Vendors</h2>
      <p className="mt-2 text-white/90">
        Every purchase here goes directly to a real local seller.
      </p>
      <a
        href="/browse"
        className="inline-block mt-4 bg-white text-red-600 font-semibold px-6 py-2 rounded-full"
      >
        Start Browsing
      </a>
    </div>
  );
}