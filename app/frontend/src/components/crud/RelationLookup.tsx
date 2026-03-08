import { useState, useEffect, useRef } from "react";
import { useLookup } from "../../hooks/useMetadata";
import type { LookupItem } from "../../types";

interface RelationLookupProps {
  entityId: string;
  value: string;
  onChange: (value: string) => void;
  displayValue?: string;
  placeholder?: string;
}

export function RelationLookup({
  entityId,
  value,
  onChange,
  displayValue = "",
  placeholder = "Buscar...",
}: RelationLookupProps) {
  const [search, setSearch] = useState(displayValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState(displayValue);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: items = [] } = useLookup(entityId, search);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!value) setSearch("");
        else setSearch(selectedDisplay);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, selectedDisplay]);

  const handleSelect = (item: LookupItem) => {
    onChange(item.id);
    setSelectedDisplay(item.display_value);
    setSearch(item.display_value);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSelectedDisplay("");
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-1 px-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      {isOpen && items.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-primary-50 ${
                item.id === value ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-700"
              }`}
            >
              {item.display_value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
