"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  setLatitude,
  setLongitude,
}) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon} />
  ) : null;
}

export default function MapPicker({
  setLatitude,
  setLongitude,
}) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="h-100 w-full rounded-2xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    </MapContainer>
  );
}