import Link from "next/link";

export default function BackButton() {
  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex font-medium text-green-600 transition-colors hover:text-green-500"
      >
        &larr; Back to tools
      </Link>
    </div>
  );
}
