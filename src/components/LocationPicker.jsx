import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";
import { Row, Col } from "react-bootstrap";

const locationIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 📍 ค่าเริ่มต้นกรณีไม่สามารถหาตำแหน่งปัจจุบันได้
const DEFAULT_POSITION = [13.7563, 100.5018];

// ------------------------------
// Component สำหรับเลือกตำแหน่ง
// ------------------------------
function LocationPicker({ setLocation, getAddress }) {
  const [position, setPosition] = useState(null);

  // 📍 ขอ Location จาก Browser
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Browser ไม่รองรับ Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = [pos.coords.latitude, pos.coords.longitude];

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
      },
    );
  }, [setLocation]);

  // 🖱️ คลิกแผนที่เพื่อเลือกตำแหน่งเอง
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];

      setPosition(newPosition);

      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} icon={locationIcon} /> : null;
}

// ------------------------------
// Component สำหรับเลื่อนแผนที่
// ไปยังตำแหน่งปัจจุบัน
// ------------------------------
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 18);
    }
  }, [position, map]);

  return null;
}

export default function DeliveryLocationMap({ getAddress }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (location) {
      //console.log("ตำแหน่งที่เลือก:", location);
      localStorage.setItem("lat", location.lat);
      localStorage.setItem("lng", location.lng);
      getAddress();
    }
  }, [location]);

  return (
    <div>
      <Row>
        <Col md={12} className="text-center">
          <h6 className="mb-3"> ตำแหน่งของคุณ</h6>

          <MapContainer
            center={DEFAULT_POSITION}
            zoom={16}
            style={{
              height: "300px",
              width: "100%",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <LocationPicker setLocation={setLocation} />

            {location && (
              <RecenterMap position={[location.lat, location.lng]} />
            )}
          </MapContainer>
        </Col>
      </Row>
    </div>
  );
}
