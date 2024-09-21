"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Result, Root } from "../../../types/shufersal";
import Image from "next/image";

interface AutocompleteInputProps {
  suggestions: Root | undefined;
  name: string;
  price: number;
  setPrice: (price: number) => void;
  setName: (name: string) => void;
}

export default function AutocompleteInput({
  name,
  setName,
  suggestions,
  setPrice,
}: AutocompleteInputProps) {

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  console.log(suggestions);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsOpen(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion: Result) => {
    setName(suggestion.name);
    setPrice(suggestion.price.value );
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
        placeholder="שם מוצר"
        className="w-full"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions?.results.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex text-xs  min-h-16 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image alt="blat" src={suggestion?.images[0].url} width={40} height={20} />
              {suggestion?.price.value} ₪ - {suggestion?.name}
              {suggestion?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
