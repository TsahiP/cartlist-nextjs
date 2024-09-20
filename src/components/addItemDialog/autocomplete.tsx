"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Root } from "../../../types/shufersal";

interface AutocompleteInputProps {
  suggestions: Root | undefined;
  name: string;
  setName: (name: string) => void;
}

export default function AutocompleteInput({
  name,
  setName,
  suggestions,
}: AutocompleteInputProps) {

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  console.log(suggestions);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsOpen(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        ref={inputRef}
        type="text"
        value={name}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className="w-full"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions?.results.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
