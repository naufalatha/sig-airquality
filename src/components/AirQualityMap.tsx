"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationData, AirQualityData } from "@/types";
import { getAQIInfo } from "@/utils/airQuality";

interface AirQualityMapProps {
  locations: LocationData[];
  airQualityData: Record<string, AirQualityData>;
  onLocationClick?: (location: LocationData) => void;
}

const AirQualityMap: React.FC<AirQualityMapProps> = ({
  locations,
  airQualityData,
  onLocationClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("map").setView([-6.2088, 106.8456], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each location
    locations.forEach((location) => {
      const data = airQualityData[location.id];
      if (!data) return;

      const aqi = data.list[0]?.main.aqi || 1;
      const aqiInfo = getAQIInfo(aqi);

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background: ${aqiInfo.color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        ">${aqi}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([location.lat, location.lon], {
        icon: customIcon,
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="text-align: center; min-width: 180px; font-family: system-ui;">
          <div style="font-weight: 600; color: #2c3e50; margin-bottom: 8px;">
            ${location.name}
          </div>
          <div style="font-size: 1.5rem; font-weight: 700; color: ${
            aqiInfo.color
          }; margin: 8px 0;">
            AQI ${aqi}
          </div>
          <div style="font-weight: 500; margin-bottom: 8px;">
            ${aqiInfo.label}
          </div>
          <div style="font-size: 0.8rem; color: #6c757d; padding-top: 8px; border-top: 1px solid #e9ecef;">
            PM2.5: ${data.list[0].components.pm2_5.toFixed(1)} μg/m³<br>
            PM10: ${data.list[0].components.pm10.toFixed(1)} μg/m³
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onLocationClick) {
        marker.on("click", () => onLocationClick(location));
      }

      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        markersRef.current.forEach((marker) => marker.remove());
      }
    };
  }, [locations, airQualityData, onLocationClick]);

  return <div id="map" className="w-full h-full" />;
};

export default AirQualityMap;
