import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-routing-machine";

interface Props {

  driver: [number, number];

  destination: [number, number];

}

export default function RouteLayer({

  driver,

  destination,

}: Props) {

  const map = useMap();

  useEffect(() => {

    const routing = L.Routing.control({

      waypoints: [

        L.latLng(driver[0], driver[1]),

        L.latLng(destination[0], destination[1]),

      ],

      addWaypoints: false,

      draggableWaypoints: false,

      fitSelectedRoutes: true,

      show: false,

      routeWhileDragging: false,

    }).addTo(map);

    return () => {

      map.removeControl(routing);

    };

  }, [driver, destination, map]);

  return null;

}