import { PersonBillResult } from "@/types/bill";

interface PersonBreakdownProps {
  result: PersonBillResult;
}

export default function PersonBreakdown({
  result,
}: PersonBreakdownProps) {
  return (
    <div className="rounded-2xl border border-gray-50 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          {result.name}
        </h3>
      </div>

      <div className="mt-6 space-y-3">
        {result.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-600">
              {item.name}
            </span>

            <span className="text-gray-900">
              ₹{item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="text-gray-900">
            ₹{result.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            GST
          </span>

          <span className="text-gray-900">
            ₹{result.gstAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Tip
          </span>

          <span className="text-gray-900">
            ₹{result.tipAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
          <span className="text-gray-900">
            Total to pay
          </span>

          <span className="text-green-600">
            ₹{result.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}