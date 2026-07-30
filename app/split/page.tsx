//app/split/page
"use client";

import { useRef, useState } from "react";

import PeopleInput from "@/components/PeopleInput";
import BillItemForm from "@/components/BillItemForm";
import TaxTipInput from "@/components/TaxTipInput";
import ReceiptUpload from "@/components/ReceiptUpload";
import PersonBreakdown from "@/components/PersonBreakdown";

import { calculateSplit } from "@/lib/calculateSplit";
import { generateFullBillPdf } from "@/lib/generateBillPdf";

import { BillItem, Person, PersonBillResult } from "@/types/bill";

export default function SplitPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [gst, setGst] = useState(0);
  const [tip, setTip] = useState(0);

  const [results, setResults] = useState<PersonBillResult[]>([]);

  const resultsRef = useRef<HTMLElement | null>(null);

  const clearResults = () => setResults([]);

  const handleSplitBill = () => {
    if (people.length < 2) {
      alert("Add at least two people.");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one bill item.");
      return;
    }

    const unassigned = items.filter(
      (item) => !item.isShared && item.assignedTo.length === 0
    );
    if (unassigned.length > 0) {
      alert(
        `${unassigned.length} item(s) aren't assigned to anyone yet: ${unassigned
          .map((i) => i.name)
          .join(", ")}. Assign them or mark them shared before splitting.`
      );
      return;
    }

    const calculatedResults = calculateSplit(people, items, gst, tip);
    setResults(calculatedResults);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mt-8 text-3xl font-bold text-gray-900">Split your bill</h1>

        <p className="mt-2 text-gray-600">
          Add everyone and enter what they ordered.
        </p>

        <PeopleInput
          people={people}
          setPeople={setPeople}
          items={items}
          setItems={setItems}
        />

        <BillItemForm people={people} items={items} setItems={setItems} />

        <TaxTipInput gst={gst} setGst={setGst} tip={tip} setTip={setTip} />

        <ReceiptUpload
          items={items}
          setItems={setItems}
          setGst={setGst}
          onBillChange={clearResults}
        />

        <button
          onClick={handleSplitBill}
          className="mt-8 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
        >
          Split Bill
        </button>

        {results.length > 0 && (
          <section ref={resultsRef} className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Bill breakdown</h2>

            <p className="mt-2 text-gray-500">
              Here&rsquo;s what everyone needs to pay.
            </p>

            <button
              onClick={() => generateFullBillPdf(results)}
              className="mt-4 rounded-xl border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50"
            >
              Download Full PDF
            </button>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {results.map((result) => (
                <PersonBreakdown key={result.personId} result={result} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}