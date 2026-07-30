//components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <h2 className="text-2xl font-bold text-white">
          SplitEasy
        </h2>

        <p className="mt-4 text-gray-400">
          Smart, simple and stress-free bill splitting.
        </p>

        <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} SplitEasy. All rights reserved.
        </div>

      </div>
    </footer>
  );
}