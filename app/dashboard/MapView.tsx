"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const blueIcon = L.divIcon({ html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2"><path d="M12 0C7.6 0 4 3.6 4 8c0 5.4 7 12 8 13 1-1 8-7.6 8-13 0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/></svg>`, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
const redIcon = L.divIcon({ html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2"><path d="M12 0C7.6 0 4 3.6 4 8c0 5.4 7 12 8 13 1-1 8-7.6 8-13 0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/></svg>`, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });

export default function MapView({ visitors }: { visitors: any[] }) {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }} className="z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {visitors.map(v => {
        const lat = v.gps_latitude || v.ip_latitude;
        const lon = v.gps_longitude || v.ip_longitude;
        if (lat && lon) {
          const isGPS = v.gps_latitude != null;
          return (
            <Marker key={v.id} position={[lat, lon]} icon={isGPS ? redIcon : blueIcon}>
              <Popup>
                <div className="p-1">
                  <strong className={isGPS ? 'text-red-500' : 'text-blue-500'}>{isGPS ? 'Exact GPS' : 'IP Location'}</strong><br />
                  IP: {v.ip_address}<br />
                  Location: {v.ip_city}, {v.ip_country}<br />
                  Accuracy: {v.gps_accuracy ? `${v.gps_accuracy}m` : 'N/A'}
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}