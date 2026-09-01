
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

// 📍 ค่าเริ่มต้นกรณีไม่สามารถหาตำแหน่งปัจจุบันได้
const DEFAULT_POSITION = [13.7563, 100.5018];

// ------------------------------
// Component สำหรับเลือกตำแหน่ง
// ------------------------------
function LocationPicker({ setLocation }) {
  const [position, setPosition] = useState(null);

  // 📍 ขอ Location จาก Browser
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Browser ไม่รองรับ Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(newPosition);

        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.log("ไม่สามารถดึงตำแหน่งปัจจุบันได้:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setLocation]);

  // 🖱️ คลิกแผนที่เพื่อเลือกตำแหน่งเอง
  useMapEvents({
    click(e) {
      const newPosition = [
        e.latlng.lat,
        e.latlng.lng,
      ];

      setPosition(newPosition);

      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} /> : null;
}

// ------------------------------
// Component สำหรับเลื่อนแผนที่
// ไปยังตำแหน่งปัจจุบัน
// ------------------------------
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}

export default function DeliveryLocationMap() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (location) {
      console.log("ตำแหน่งที่เลือก:", location);
      localStorage.setItem("lat", location.lat);
      localStorage.setItem("lng", location.lng);
    } }, [location]);

  return (
    <div>
      <h2>📍 ปักหมุดตำแหน่งของคุณ</h2>

      <MapContainer
        center={DEFAULT_POSITION}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <LocationPicker setLocation={setLocation} />

        {location && (
          <RecenterMap
            position={[location.lat, location.lng]}
          />
        )}
      </MapContainer>

      {location && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
      {location && (
  <div>
    


  </div>
)}
    </div>
  );
}

