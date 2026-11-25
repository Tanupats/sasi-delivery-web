import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";

const NavigationMap = ({ destination, address, riderLocation }) => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const routeOriginRef = useRef(null);
  const latestRiderLocationRef = useRef(riderLocation);
  const [routeStatus, setRouteStatus] = useState("กำลังรอสัญญาณ GPS");

  useEffect(() => {
    latestRiderLocationRef.current = riderLocation;
  }, [riderLocation]);

  useEffect(() => {
    const destinationPoint = L.latLng(destination.lat, destination.lng);
    const map = L.map(mapElement.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(destinationPoint, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const destinationIcon = L.divIcon({
      className: "",
      html: '<span class="orders-map-destination-marker"></span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const destinationPopup = L.DomUtil.create(
      "div",
      "orders-map-destination-popup",
    );
    destinationPopup.textContent = address || "ไม่ระบุที่อยู่ในบิล";
    L.marker(destinationPoint, { icon: destinationIcon })
      .addTo(map)
      .bindPopup(destinationPopup)
      .openPopup();

    mapRef.current = map;
    const resizeTimeout = window.setTimeout(() => map.invalidateSize(), 300);

    return () => {
      window.clearTimeout(resizeTimeout);
      map.remove();
      mapRef.current = null;
      riderMarkerRef.current = null;
      routeLayerRef.current = null;
      routeOriginRef.current = null;
    };
  }, [address, destination.lat, destination.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !riderLocation) return;

    const riderPoint = L.latLng(riderLocation.lat, riderLocation.lng);
    if (!riderMarkerRef.current) {
      const riderIcon = L.divIcon({
        className: "",
        html: '<span class="orders-map-rider-marker"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      riderMarkerRef.current = L.marker(riderPoint, { icon: riderIcon })
        .addTo(map)
        .bindPopup("ตำแหน่งของคุณ");

      map.fitBounds(
        L.latLngBounds([
          riderPoint,
          L.latLng(destination.lat, destination.lng),
        ]),
        { padding: [40, 40], maxZoom: 16 },
      );
    } else {
      riderMarkerRef.current.setLatLng(riderPoint);
    }
  }, [destination.lat, destination.lng, riderLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    let active = true;
    let controller;
    const loadRoute = async () => {
      const location = latestRiderLocationRef.current;
      if (!location) return;

      const origin = L.latLng(location.lat, location.lng);
      if (routeOriginRef.current?.distanceTo(origin) < 100) return;
      routeOriginRef.current = origin;
      controller?.abort();
      controller = new AbortController();
      setRouteStatus("กำลังคำนวณเส้นทาง");

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Route request failed");
        const result = await response.json();
        const geometry = result.routes?.[0]?.geometry;
        if (!geometry) throw new Error("No route found");
        if (!active) return;

        routeLayerRef.current?.remove();
        routeLayerRef.current = L.geoJSON(geometry, {
          style: { color: "#18794e", weight: 5, opacity: 0.8 },
        }).addTo(map);
        setRouteStatus("เส้นทางพร้อมแล้ว · ลากเพื่อเลื่อน ซูมด้วยปุ่มหรือ scroll");
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setRouteStatus("ไม่สามารถโหลดเส้นทางได้ แต่ยังดูตำแหน่งบนแผนที่ได้");
        }
      }
    };

    loadRoute();
    const routeInterval = window.setInterval(loadRoute, 30000);
    return () => {
      active = false;
      window.clearInterval(routeInterval);
      controller?.abort();
    };
  }, [destination.lat, destination.lng]);

  return (
    <>
      <div
        ref={mapElement}
        className="orders-navigation-map"
        role="region"
        aria-label="แผนที่นำทาง ลากเพื่อเลื่อนและซูมเพื่อปรับมุมมอง"
      />
      <small className="orders-navigation-map-status" role="status">
        {routeStatus}
      </small>
    </>
  );
};

NavigationMap.propTypes = {
  destination: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  address: PropTypes.string,
  riderLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default NavigationMap;
