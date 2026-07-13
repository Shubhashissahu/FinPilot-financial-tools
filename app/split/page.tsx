"use client";

import { useState } from "react";
import Link from "next/link";

import PeopleInput from "@/components/Peopleinput";
import BillItemForm from "@/components/BillItemForm";

import { BillItem, Person } from "@/types/bill";

export default function SplitPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);

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
      </div>
    </main>
  );
}