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

    if (checked) {
      setSelectedPeople(
        people.map((person) => person.id)
      );
    } else {
      setSelectedPeople([]);
    }
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

    if (selectedPeople.length === 0) {
      setError("Select at least one person.");
      return;
    }

    const newItem: BillItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      price: Number(price),
      assignedTo: selectedPeople,
      isShared,
    };

    setItems((prev) => [
      ...prev,
      newItem,
    ]);

    setItemName("");
    setPrice("");
    setSelectedPeople([]);
    setIsShared(false);
    setError("");
  };

  const removeItem = (itemId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Add bill items
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Enter each item and choose who ordered it.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Item name
          </label>

          <input
            type="text"
            placeholder="e.g. Pizza"
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Price
          </label>

          <input
            type="number"
            placeholder="₹0"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) =>
              handleSharedChange(e.target.checked)
            }
          />

          Shared by everyone
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700">
          Who ordered this?
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {people.map((person) => (
            <label
              key={person.id}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                isShared
                  ? "cursor-not-allowed bg-gray-50 text-gray-400"
                  : "cursor-pointer border-gray-200 text-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPeople.includes(person.id)}
                disabled={isShared}
                onChange={() =>
                  togglePerson(person.id)
                }
              />

              {person.name}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={addItem}
        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
      >
        Add Item
      </button>


      {/* Added items */}
      {items.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900">
            Added items
          </h3>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.isShared
                      ? "Shared by everyone"
                      : item.assignedTo
                          .map((personId) =>
                            people.find(
                              (person) =>
                                person.id === personId
                            )?.name
                          )
                          .filter(Boolean)
                          .join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-sm text-gray-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}