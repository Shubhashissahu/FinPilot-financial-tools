//components/PersonBreakdown.tsx
import { PersonBillResult } from "@/types/bill";
import ShareActions from "@/components/ShareActions";

interface PersonBreakdownProps {
  result: PersonBillResult;
}

export default function PersonBreakdown({
  result,
}: PersonBreakdownProps) {
  return (
    <div className="rounded-2xl border border-gray-50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {result.name}
        </h3>
      </div>

      <div className="mt-6 space-y-3">
        {result.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
              {item.name}
            </span>

            <span className="text-gray-900 dark:text-white">
              ₹{item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-200 dark:border-neutral-800 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Subtotal
          </span>

          <span className="text-gray-900 dark:text-white">
            ₹{result.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
            GST
          </span>

          <span className="text-gray-900 dark:text-white">
            ₹{result.gstAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Tip
          </span>

          <span className="text-gray-900 dark:text-white">
            ₹{result.tipAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-200 dark:border-neutral-800 pt-3 font-semibold">
          <span className="text-gray-900 dark:text-white">
            Total to pay
          </span>

          <span className="text-green-600">
            ₹{result.total.toFixed(2)}
          </span>
        </div>
        <ShareActions result={result} />
      </div>
    </div>
  );
}