//componets/Peopleinput
"use client";

import { useState } from "react";
import { BillItem, Person } from "@/types/bill";

interface PeopleInputProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
}

export default function PeopleInput({
  people,
  setPeople,
  items,
  setItems,
}: PeopleInputProps) {
  const [personName, setPersonName] = useState("");
  const [error, setError] = useState("");

  const addPerson = () => {
    const trimmedName = personName.trim();

    if (!trimmedName) {
      setError("Please enter a name.");
      return;
    }

    const personExists = people.some(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (personExists) {
      setError("This person has already been added.");
      return;
    }

    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    setPeople([...people, newPerson]);
    setPersonName("");
    setError("");
  };

  const removePerson = (id: string) => {
    // Check before removing so we can warn if this orphans an item that's
    // ONLY assigned to this person (not shared) — otherwise that item
    // silently ends up assigned to no one and gets excluded from the split
    // with no indication why.
    const affectedItems = items.filter(
      (item) => !item.isShared && item.assignedTo.length === 1 && item.assignedTo[0] === id
    );

    if (affectedItems.length > 0) {
      const names = affectedItems.map((i) => i.name).join(", ");
      const proceed = window.confirm(
        `${names} ${affectedItems.length > 1 ? "are" : "is"} only assigned to this person. Removing them will leave ${
          affectedItems.length > 1 ? "these items" : "this item"
        } unassigned. Continue?`
      );
      if (!proceed) return;
    }

    setPeople((prev) => prev.filter((person) => person.id !== id));

    // Strip the removed person out of every item's assignedTo so nothing
    // references a person that no longer exists.
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((personId) => personId !== id),
      }))
    );
  };

  return (
    <section className="mt-10 rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Who&rsquo;s splitting?</h2>
      <p className="mt-1 text-sm text-gray-500">Add everyone who is part of this bill.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPerson();
        }}
        className="mt-6 flex gap-3"
      >
        <input
          type="text"
          placeholder="Enter a name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
        >
          Add
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-green-700"
          >
            <span>{person.name}</span>
            <button
              onClick={() => removePerson(person.id)}
              className="text-green-700 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}