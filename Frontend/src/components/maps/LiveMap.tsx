import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

const driverIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],
});

interface Props {
  driverLocation: {
    lat: number;
    lng: number;
  };
}

export default function LiveMap({
  driverLocation,
}: Props) {
  return (
    <MapContainer
      center={[
        driverLocation.lat,
        driverLocation.lng,
      ]}
      zoom={15}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[
          driverLocation.lat,
          driverLocation.lng,
        ]}
        icon={driverIcon}
      >
        <Popup>

          Driver Location

        </Popup>

      </Marker>

    </MapContainer>
  );
}


// import { MapContainer, TileLayer } from "react-leaflet";

// export default function LiveMap() {
//   return (
//     <MapContainer
//       center={[28.6139, 77.2090]}
//       zoom={13}
//       style={{ height: "500px", width: "100%" }}
//     >
//       <TileLayer
//         attribution="© OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//     </MapContainer>
//   );
// }