import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Shipment, ShipmentStatus } from '../types';
import L from 'leaflet';

interface ShipmentMapProps {
  shipments: Shipment[];
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments }) => {
  // Custom Icon generation to avoid standard Leaflet asset issues in React build
  const createCustomIcon = (iconClass: string, color: string) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
               <i class="${iconClass}" style="color: white; font-size: 12px;"></i>
             </div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const originIcon = createCustomIcon('fas fa-warehouse', '#64748b'); // Slate-500
  const destIcon = createCustomIcon('fas fa-map-pin', '#cc0000'); // AJC Red
  
  const getShipmentColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.IN_TRANSIT: return '#003366'; // AJC Blue
      case ShipmentStatus.CUSTOMS: return '#eab308'; // Yellow
      case ShipmentStatus.PENDING: return '#9ca3af'; // Gray
      case ShipmentStatus.DELIVERED: return '#22c55e'; // Green
      default: return '#003366';
    }
  };

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-card border border-gray-100 z-0 relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {shipments.map((shipment) => {
          if (!shipment.origin_lat || !shipment.dest_lat) return null;

          return (
            <React.Fragment key={shipment.id}>
              {/* Origin Marker */}
              <Marker position={[shipment.origin_lat, shipment.origin_lng!] as [number, number]} icon={originIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Origin: {shipment.origin}</strong><br/>
                    {shipment.tracking_number}
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={[shipment.dest_lat!, shipment.dest_lng!] as [number, number]} icon={destIcon}>
                 <Popup>
                  <div className="text-xs font-sans">
                    <strong>Dest: {shipment.destination}</strong><br/>
                    Product: {shipment.product_name}<br/>
                    ETA: {new Date(shipment.eta).toLocaleDateString()}
                  </div>
                </Popup>
              </Marker>

              {/* Route Line */}
              <Polyline 
                positions={[
                  [shipment.origin_lat, shipment.origin_lng!] as [number, number],
                  [shipment.dest_lat!, shipment.dest_lng!] as [number, number]
                ]}
                pathOptions={{ 
                    color: getShipmentColor(shipment.status), 
                    weight: 2, 
                    dashArray: shipment.status === ShipmentStatus.PENDING ? '5, 10' : undefined,
                    opacity: 0.7
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;