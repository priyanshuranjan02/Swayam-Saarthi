import { LocationResult } from "@/components/location/types";

export async function searchLocations(
  query: string
): Promise<LocationResult[]> {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&limit=5`
    );

    const data = await response.json();

    return data.features.map((feature: any) => {
      const lat = feature.geometry.coordinates[1];
      const lon = feature.geometry.coordinates[0];
        
      return {
        name: [
          feature.properties.name,
          feature.properties.city,
          feature.properties.state,
        ]
          .filter(Boolean)
          .join(", "),
    
        lat,
        lon,
        lng: lon, // keep for Leaflet compatibility
      };
    });
  } catch (error) {
    console.error("Location search failed:", error);
    return [];
  }
}