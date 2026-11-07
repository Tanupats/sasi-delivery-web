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
import { Row, Col, Button } from "react-bootstrap";

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
function LocationPicker({ location, setLocation }) {
  // 🖱️ คลิกแผนที่เพื่อเลือกตำแหน่งเอง
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return location ? (
    <Marker position={[location.lat, location.lng]} icon={locationIcon} />
  ) : null;
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
  const [locationResolved, setLocationResolved] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const requestCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      console.log("Browser ไม่รองรับ Geolocation");
      setLocationResolved(true);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationResolved(true);
        setIsLocating(false);
      },
      (error) => {
        console.log("ไม่สามารถดึงตำแหน่งปัจจุบันได้:", error);
        setLocationResolved(true);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

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

          {!locationResolved ? (
            <Button onClick={requestCurrentLocation} disabled={isLocating}>
              {isLocating ? "กำลังค้นหาตำแหน่ง..." : "ใช้ตำแหน่งปัจจุบัน"}
            </Button>
          ) : (
            <MapContainer
              center={
                location
                  ? [location.lat, location.lng]
                  : DEFAULT_POSITION
              }
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

              <LocationPicker location={location} setLocation={setLocation} />

              {location && (
                <RecenterMap position={[location.lat, location.lng]} />
              )}
            </MapContainer>
          )}
        </Col>
      </Row>
    </div>
  );
}
