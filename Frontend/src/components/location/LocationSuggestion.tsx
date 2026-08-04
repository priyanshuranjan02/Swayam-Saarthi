import { MapPin } from "lucide-react";
import { LocationResult } from "./types";

interface Props {
  location: LocationResult;
  onSelect: (location: LocationResult) => void;
}

export default function LocationSuggestion({
  location,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(location)}
      className="
        w-full
        text-left
        px-4
        py-3
        hover:bg-muted
        flex
        gap-3
        items-start
        border-b
      "
    >
      <MapPin
        className="mt-1"
        size={18}
      />

      <span className="text-sm">
        {location.name}
      </span>
    </button>
  );
}