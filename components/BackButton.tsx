import Link from "next/link";

export default function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-xs transition-all hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-emerald-700 dark:hover:text-emerald-400"
      >
        <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
        <span>Back to tools</span>
      </Link>
    </div>
  );
}

