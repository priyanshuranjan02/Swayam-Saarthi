export interface RouteData {
  distance: number;      // km
  duration: number;      // minutes
  geometry: number[][];
}

export async function getRoute(
  pickup: {
    lat: number;
    lon: number;
  },
  drop: {
    lat: number;
    lon: number;
  }
): Promise<RouteData> {

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${pickup.lon},${pickup.lat};${drop.lon},${drop.lat}` +
    `?overview=full&geometries=geojson`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch route");
  }

  const data = await res.json();

  const route = data.routes[0];

  return {
    distance: route.distance / 1000,
    duration: route.duration / 60,
    geometry: route.geometry.coordinates
  };
}