//components/TaxTipinput.tsx
interface TaxTipInputProps {
  gst: number;
  setGst: React.Dispatch<React.SetStateAction<number>>;
  tip: number;
  setTip: React.Dispatch<React.SetStateAction<number>>;
}

export default function TaxTipInput({
  gst,
  setGst,
  tip,
  setTip,
}: TaxTipInputProps) {
  const handleGstChange = (value: string) => {
    const n = Number(value);
    setGst(Number.isFinite(n) ? Math.max(0, n) : 0);
  };

  const handleTipChange = (value: string) => {
    const n = Number(value);
    setTip(Number.isFinite(n) ? Math.max(0, n) : 0);
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Additional charges
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
        Add GST and tip percentages.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            GST %
          </label>

          <input
            type="number"
            min="0"
            value={gst}
            onChange={(e) => handleGstChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tip %
          </label>

          <input
            type="number"
            min="0"
            value={tip}
            onChange={(e) => handleTipChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500"
          />
        </div>
      </div>
    </section>
  );
}