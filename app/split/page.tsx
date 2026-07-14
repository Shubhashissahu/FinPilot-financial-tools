"use client";

import { useState } from "react";
import Link from "next/link";

import PeopleInput from "@/components/Peopleinput";
import BillItemForm from "@/components/BillItemForm";
import TaxTipInput from "@/components/TaxTipInput";
import { calculateSplit } from "@/lib/calculateSplit";
import PersonBreakdown from "@/components/PersonBreakdown";

import {
  BillItem,
  Person,
  PersonBillResult,
} from "@/types/bill";

export default function SplitPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [gst, setGst] = useState(0);
const [tip, setTip] = useState(0);
const [results, setResults] = useState<
  PersonBillResult[]
>([]);

const handleSplitBill = () => {
  if (people.length < 2) {
    alert("Add at least two people.");
    return;
  }

  if (items.length === 0) {
    alert("Add at least one bill item.");
    return;
  }

  const calculatedResults = calculateSplit(
    people,
    items,
    gst,
    tip
  );

  setResults(calculatedResults);
};
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-green-600"
        >
          ← Back to home
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-gray-900">
          Split your bill
        </h1>

        <p className="mt-2 text-gray-600">
          Add everyone and enter what they ordered.
        </p>

        <PeopleInput
          people={people}
          setPeople={setPeople}
        />

        <BillItemForm
          people={people}
          items={items}
          setItems={setItems}
        />
        <TaxTipInput
  gst={gst}
  setGst={setGst}
  tip={tip}
  setTip={setTip}
/>

<button
  onClick={handleSplitBill}
  className="mt-8 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
>
  Split Bill
</button>
{results.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-bold text-gray-900">
      Bill breakdown
    </h2>

    <p className="mt-2 text-gray-500">
      Here s what everyone needs to pay.
    </p>

    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {results.map((result) => (
        <PersonBreakdown
          key={result.personId}
          result={result}
        />
      ))}
    </div>
  </section>
)}
      </div>
    </main>
  );
}