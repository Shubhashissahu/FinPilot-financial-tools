//components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white font-bold">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              SplitEasy
            </h1>
            <p className="text-xs text-gray-500">
              Smart bill splitting
            </p>
          </div>
        </Link>

        <Link
          href="/split"
          className="rounded-xl bg-green-600 px-5 py-2.5 font-medium text-white transition hover:scale-105 hover:bg-green-700"
        >
          Start Splitting
        </Link>
      </div>
    </header>
  );
}