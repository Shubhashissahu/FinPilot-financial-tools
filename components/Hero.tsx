//components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-green-200/40 blur-[120px]" />
      <div className="absolute right-0 top-40 h-[450px] w-[450px] rounded-full bg-emerald-200/40 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-18 px-6 py-22 lg:min-h-[85vh] lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div>
          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            ✨ Fair bill splitting made simple
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-gray-900 md:text-6xl">
            Split bills
            <br />
            <span className="text-green-600">
              without awkward math.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Easily split restaurant bills, trips, parties and shared
            expenses. Assign items, split shared dishes, and calculate GST &
            tips automatically.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/split"
              className="rounded-xl bg-green-600 px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
            >
              Start Splitting →
            </Link>

            <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-7 py-4 font-semibold text-gray-700 transition hover:border-green-500 hover:bg-green-50">
              ▶ Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">10K+</h2>
              <p className="text-gray-500">Bills Split</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900">5K+</h2>
              <p className="text-gray-500">Users</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900">4.9★</h2>
              <p className="text-gray-500">Rating</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">
          {/* Top Card */}
          <div className="absolute -top-4 right-0 hidden rounded-2xl bg-white p-5 shadow-xl lg:block">
            <p className="text-sm text-gray-500">💰 Total Saved</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">₹120</h3>
          </div>

          {/* Left Card */}
          <div className="absolute -left-10 top-40 hidden rounded-2xl bg-white p-5 shadow-xl lg:block">
            <p className="text-sm text-gray-500">👤 Alice owes</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">₹420</h3>
          </div>

          {/* Bottom Card */}
          <div className="absolute bottom-10 -right-8 hidden rounded-xl bg-green-600 px-5 py-3 text-white shadow-xl lg:block">
            ✓ Split Complete
          </div>

          {/* Phone */}
          <div className="w-[360px] rounded-[42px] border-[10px] border-slate-900 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,.15)]">
            {/* Notch */}
            <div className="mx-auto mb-6 h-2 w-24 rounded-full bg-gray-300" />

            <div className="rounded-2xl bg-green-600 p-5 text-white">
              <h3 className="text-lg font-bold">
                🍽 Dinner at BBQ Nation
              </h3>

              <p className="mt-1 text-sm text-green-100">
                3 Friends
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <BillItem item="🍕 Pizza" price="₹650" />
              <BillItem item="🍔 Burger" price="₹350" />
              <BillItem item="🥤 Drinks" price="₹420" />
              <BillItem item="🍟 Fries" price="₹180" />
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <div className="flex justify-between text-gray-600">
                <span>GST</span>
                <span>₹144</span>
              </div>

              <div className="mt-2 flex justify-between text-gray-600">
                <span>Tip</span>
                <span>₹100</span>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹1,844</span>
                </div>
              </div>

              <button className="mt-5 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700">
                Calculate Split
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BillItem({
  item,
  price,
}: {
  item: string;
  price: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
      <span className="font-medium text-gray-700">{item}</span>

      <span className="font-semibold text-gray-900">{price}</span>
    </div>
  );
}