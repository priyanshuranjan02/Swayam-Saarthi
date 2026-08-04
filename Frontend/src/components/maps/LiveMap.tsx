import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import { useEffect, useRef } from "react";
import L from "leaflet";

/* ================= ICONS ================= */

const driverIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const dropIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ================= TYPES ================= */

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  driverLocation: {
    lat: number;
    lng: number;
  };

  targetLocation: {
    lat: number;
    lng: number;
  };

  setDriverLocation: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;

  pickupLocation: {
    lat: number;
    lng: number;
  };

  dropLocation: {
    lat: number;
    lng: number;
  };

  route: [number, number][];
}

/* ================= FIT MAP ================= */

function FitBounds({
  driverLocation,
  pickupLocation,
  dropLocation,
}: {
  driverLocation: LatLng;
  pickupLocation: LatLng;
  dropLocation: LatLng;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [driverLocation.lat, driverLocation.lng],
      [pickupLocation.lat, pickupLocation.lng],
      [dropLocation.lat, dropLocation.lng],
    ]);

    map.fitBounds(bounds, {
      padding: [60, 60],
    });
  }, [driverLocation, pickupLocation, dropLocation, map]);

  return null;
}

function AnimatedDriverMarker({
  driverLocation,
  icon,
}: {
  driverLocation: LatLng;
  icon: L.Icon;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (!markerRef.current) return;

    const marker = markerRef.current;

    const start = marker.getLatLng();
    const end = L.latLng(
      driverLocation.lat,
      driverLocation.lng
    );

    const duration = 800;
    const startTime = performance.now();

    function animate(time: number) {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const lat =
        start.lat +
        (end.lat - start.lat) * progress;

      const lng =
        start.lng +
        (end.lng - start.lng) * progress;

      marker.setLatLng([lat, lng]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);

  }, [driverLocation]);

  return (
    <Marker
      ref={markerRef}
      position={[
        driverLocation.lat,
        driverLocation.lng,
      ]}
      icon={icon}
    >
      <Popup>Driver</Popup>
    </Marker>
  );
}

/* ================= MAP ================= */

export default function LiveMap({
  driverLocation,
  pickupLocation,
  dropLocation,
  targetLocation,
  setDriverLocation,
  route = [],
}: Props) {
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setDriverLocation((prev) => {
    //       const dx = targetLocation.lat - prev.lat;
    //       const dy = targetLocation.lng - prev.lng;

    //       const distance = Math.sqrt(dx * dx + dy * dy);

    //       if (distance < 0.00001) {
    //         return targetLocation;
    //       }

    //       return {
    //         lat: prev.lat + dx * 0.08,
    //         lng: prev.lng + dy * 0.08,
    //       };
    //     });
    //   }, 16);

    //   return () => clearInterval(interval);
    // }, [targetLocation, setDriverLocation]);

    useEffect(() => {
      setDriverLocation(targetLocation);
    }, [targetLocation, setDriverLocation]);
  
    return (
    <MapContainer
      center={[
        pickupLocation.lat,
        pickupLocation.lng,
      ]}
      zoom={14}
      style={{
        height:
          window.innerWidth < 640
            ? "320px"
            : "500px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds
        driverLocation={driverLocation}
        pickupLocation={pickupLocation}
        dropLocation={dropLocation}
      />

      {/* Pickup */}

      <Marker
        position={[
          pickupLocation.lat,
          pickupLocation.lng,
        ]}
        icon={pickupIcon}
      >
        <Popup>Pickup</Popup>
      </Marker>

      {/* Drop */}

      <Marker
        position={[
          dropLocation.lat,
          dropLocation.lng,
        ]}
        icon={dropIcon}
      >
        <Popup>Drop</Popup>
      </Marker>

      {/* Driver */}

      <AnimatedDriverMarker
        driverLocation={driverLocation}
        icon={driverIcon}
      />

      {/* Route */}

      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
          }}
        />
      )}
    </MapContainer>
  );
}