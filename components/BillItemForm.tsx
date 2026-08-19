//components/BillitemForm
"use client";

import { useState } from "react";
import { BillItem, Person } from "@/types/bill";

interface BillItemFormProps {
  people: Person[];
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
}

export default function BillItemForm({
  people,
  items,
  setItems,
}: BillItemFormProps) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState("");

  const togglePerson = (id: string) => {
    setSelectedPeople((prev) =>
      prev.includes(id)
        ? prev.filter((personId) => personId !== id)
        : [...prev, id]
    );
  };

  const handleSharedChange = (checked: boolean) => {
    setIsShared(checked);
    setSelectedPeople([]);
  };

  const addItem = () => {
    if (!itemName.trim()) {
      setError("Please enter an item name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!isShared && selectedPeople.length === 0) {
      setError("Select at least one person.");
      return;
    }

    const newItem: BillItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      price: Number(price),
      assignedTo: isShared ? [] : selectedPeople,
      isShared,
    };

    setItems((prev) => [...prev, newItem]);

    setItemName("");
    setPrice("");
    setSelectedPeople([]);
    setIsShared(false);
    setError("");
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Lets someone fix assignment on ANY item already in the list — critical
  // for OCR-imported items, which land here with assignedTo: [] and no
  // other way to assign them short of deleting and re-adding manually.
  const toggleItemAssignee = (itemId: string, personId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const has = item.assignedTo.includes(personId);
        return {
          ...item,
          isShared: false,
          assignedTo: has
            ? item.assignedTo.filter((id) => id !== personId)
            : [...item.assignedTo, personId],
        };
      })
    );
  };

  const setItemShared = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isShared: true, assignedTo: [] } : item
      )
    );
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add bill items</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Enter each item and choose who ordered it.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Item name</label>
          <input
            type="text"
            placeholder="e.g. Pizza"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
          <input
            type="number"
            placeholder="₹0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 dark:border-neutral-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => handleSharedChange(e.target.checked)}
          />
          Shared by everyone
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Who ordered this?</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {people.map((person) => (
            <label
              key={person.id}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                isShared
                  ? "cursor-not-allowed bg-gray-50 dark:bg-neutral-900/50 text-gray-400 dark:text-gray-500"
                  : "cursor-pointer border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={isShared ? true : selectedPeople.includes(person.id)}
                disabled={isShared}
                onChange={() => togglePerson(person.id)}
              />
              {person.name}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={addItem}
        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
      >
        Add Item
      </button>

      {items.length > 0 && (
        <div className="mt-8 border-t border-gray-200 dark:border-neutral-800 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Added items</h3>
          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const isUnassigned = !item.isShared && item.assignedTo.length === 0;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl p-4 ${
                    isUnassigned ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50" : "bg-gray-50 dark:bg-neutral-900/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className={`mt-1 text-sm ${isUnassigned ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                        {item.isShared
                          ? "Shared by everyone"
                          : item.assignedTo.length > 0
                          ? item.assignedTo
                              .map((personId) => people.find((p) => p.id === personId)?.name)
                              .filter(Boolean)
                              .join(", ")
                          : "Not assigned yet — pick who ordered this below"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-gray-900 dark:text-white">₹{item.price.toFixed(2)}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setItemShared(item.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                        item.isShared
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:border-green-300"
                      }`}
                    >
                      Shared by everyone
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-500">or assign to:</span>
                    {people.map((person) => {
                      const active = !item.isShared && item.assignedTo.includes(person.id);
                      return (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => toggleItemAssignee(item.id, person.id)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                            active
                              ? "bg-gray-900 border-gray-900 text-white"
                              : "border-gray-300 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:border-green-300"
                          }`}
                        >
                          {person.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}