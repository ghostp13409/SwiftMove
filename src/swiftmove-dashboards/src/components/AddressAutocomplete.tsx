import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface AddressResult {
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalOrZipCode: string;
  latitude: number;
  longitude: number;
  display_name: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export const AddressAutocomplete = ({
  onAddressSelect,
  placeholder = "Search address...",
  defaultValue = "",
  className,
}: AddressAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.length > 2) {
        searchAddress(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const searchAddress = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );

      const results: AddressResult[] = response.data.map((item: any) => {
        const addr = item.address;
        
        // Extracting parts from Nominatim response
        const line1 = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || "";
        const city = addr.city || addr.town || addr.village || addr.municipality || "";
        const state = addr.state || addr.province || addr.region || "";
        const country = addr.country || "";
        const postalCode = addr.postcode || "";

        return {
          line1: line1,
          city: city,
          stateOrProvince: state,
          country: country,
          postalOrZipCode: postalCode,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          display_name: item.display_name,
        };
      });

      setSuggestions(results);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (suggestion: AddressResult) => {
    setValue(suggestion.display_name);
    setOpen(false);
    onAddressSelect(suggestion);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-11 rounded-xl bg-secondary/30 font-normal", className)}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">{value || placeholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Type to search..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {isLoading && (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && suggestions.length === 0 && inputValue.length > 2 && (
              <CommandEmpty>No address found.</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  value={suggestion.display_name}
                  onSelect={() => handleSelect(suggestion)}
                  className="flex flex-col items-start gap-1 py-3"
                >
                  <div className="flex items-center w-full">
                    <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <span className="font-medium text-sm line-clamp-1">
                      {suggestion.line1 || suggestion.display_name.split(',')[0]}
                    </span>
                    {value === suggestion.display_name && (
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2 pl-6">
                    {suggestion.display_name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
