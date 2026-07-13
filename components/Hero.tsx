import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">

        <span className="inline-block rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          Simple. Fair. Stress-free.
        </span>

        <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900">
          Split bills without the
          <span className="text-green-600">
            {" "}awkward maths.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Add your friends, enter what everyone ordered,
          and we ll calculate exactly who owes what.
        </p>

        <div className="mt-10">
          <Link
            href="/split"
            className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Split a Bill
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <span>✓ Itemised splitting</span>
          <span>✓ Shared items</span>
          <span>✓ GST & tip calculation</span>
        </div>

      </div>
    </section>
  );
}