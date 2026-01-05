import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { getAddressSuggestions } from "@/lib/mapbox";

interface AddressInputProps {
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
}

export function AddressInput({ value, onChange, placeholder = "Search address..." }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (value.length > 2) {
      getAddressSuggestions(value).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={onChange}
      />
      {suggestions.length > 0 && (
        <CommandList>
          <CommandGroup>
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  onChange(suggestion.place_name, {
                    lat: suggestion.center[1],
                    lng: suggestion.center[0]
                  });
                  setSuggestions([]);
                }}
              >
                {suggestion.place_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}