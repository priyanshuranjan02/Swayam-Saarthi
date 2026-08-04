import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import LocationSuggestion from "./LocationSuggestion";
import { LocationResult } from "./types";
import { searchLocations } from "@/services/locationService";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: LocationResult) => void;
  icon?: React.ReactNode;
}

// const LOCATIONS: LocationResult[] = [
//   {
//     name: "VIT Bhopal University",
//     lat: 23.077,
//     lng: 76.851,
//   },
//   {
//     name: "DB Mall, Bhopal",
//     lat: 23.233,
//     lng: 77.432,
//   },
//   {
//     name: "Bhopal Junction",
//     lat: 23.259,
//     lng: 77.412,
//   },
// ];

export default function LocationSearch({
  label,
  placeholder,
  value,
  onChange,
  onLocationSelect,
  icon,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [filteredSuggestions, setFilteredSuggestions] =
    useState<LocationResult[]>([]);

  // ----------------------------------
  // Debounced Search
  // ----------------------------------

  useEffect(() => {
    if (value.trim().length < 2) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
        const fetchLocations = async () => {
            const results = await searchLocations(value);
        
            setFilteredSuggestions(results);
            setLoading(false);
            setShowSuggestions(true);
            setSelectedIndex(-1);
        };
    
        fetchLocations();
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // ----------------------------------
  // Click Outside
  // ----------------------------------

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ----------------------------------
  // Keyboard Navigation
  // ----------------------------------

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1
            ? prev + 1
            : prev
        );

        break;

      case "ArrowUp":
        e.preventDefault();

        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : 0
        );

        break;

      case "Escape":
        setShowSuggestions(false);
        break;

      case "Enter":
        e.preventDefault();

        if (selectedIndex >= 0) {
          const location =
            filteredSuggestions[selectedIndex];

          onLocationSelect(location);
          onChange(location.name);
          setShowSuggestions(false);

          setShowSuggestions(false);
        }

        break;
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="font-medium">{label}</label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {icon}
          </div>
        )}

        <Input
          value={value}
          placeholder={placeholder}
          className="pl-10"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Loading */}

        {loading && (
          <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-background shadow-xl p-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {/* Suggestions */}

        {!loading &&
          showSuggestions &&
          filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-background shadow-xl overflow-hidden z-50">
              {filteredSuggestions.map(
                (location, index) => (
                  <div
                    key={location.name}
                    className={
                      index === selectedIndex
                        ? "bg-accent"
                        : ""
                    }
                  >
                    <LocationSuggestion
                      location={location}
                      onSelect={(selected) => {
                        onLocationSelect(selected);
                        onChange(selected.name);
                        setShowSuggestions(false);
                      }}
                    />
                  </div>
                )
              )}
            </div>
          )}

        {/* No Results */}

        {!loading &&
          showSuggestions &&
          value.length >= 2 &&
          filteredSuggestions.length === 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl border bg-background shadow-xl p-4 text-center text-muted-foreground z-50">
              No locations found
            </div>
          )}
      </div>
    </div>
  );
}