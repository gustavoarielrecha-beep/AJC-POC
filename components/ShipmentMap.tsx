import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Shipment, ShipmentStatus } from '../types';
import L from 'leaflet';

interface ShipmentMapProps {
  shipments: Shipment[];
  selectedShipmentId?: string | null;
}

// Sub-component to handle map zooming/panning effects
const MapController: React.FC<{ selectedShipment?: Shipment }> = ({ selectedShipment }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedShipment && selectedShipment.origin_lat && selectedShipment.dest_lat) {
      const bounds = L.latLngBounds(
        [selectedShipment.origin_lat, selectedShipment.origin_lng!],
        [selectedShipment.dest_lat, selectedShipment.dest_lng!]
      );
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [selectedShipment, map]);

  return null;
};

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, selectedShipmentId }) => {
  // Custom Icon generation
  const createCustomIcon = (iconClass: string, color: string, isDimmed: boolean) => {
    const opacity = isDimmed ? 0.4 : 1;
    return L.divIcon({
      html: `<div style="background-color: ${color}; opacity: ${opacity}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
               <i class="${iconClass}" style="color: white; font-size: 12px;"></i>
             </div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const getShipmentColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.IN_TRANSIT: return '#003366'; // AJC Blue
      case ShipmentStatus.CUSTOMS: return '#eab308'; // Yellow
      case ShipmentStatus.PENDING: return '#9ca3af'; // Gray
      case ShipmentStatus.DELIVERED: return '#22c55e'; // Green
      default: return '#003366';
    }
  };

  // Determine active shipment object
  const activeShipment = shipments.find(s => s.id === selectedShipmentId);

  return (
    <div className="h-full w-full z-0 relative">
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

        <MapController selectedShipment={activeShipment} />

        {shipments.map((shipment) => {
          if (!shipment.origin_lat || !shipment.dest_lat) return null;

          const isSelected = selectedShipmentId === shipment.id;
          const isDimmed = selectedShipmentId ? !isSelected : false;

          const originIcon = createCustomIcon('fas fa-warehouse', '#64748b', isDimmed); 
          const destIcon = createCustomIcon('fas fa-map-pin', '#cc0000', isDimmed); 

          return (
            <React.Fragment key={shipment.id}>
              {/* Origin Marker */}
              <Marker 
                position={[shipment.origin_lat, shipment.origin_lng!] as [number, number]} 
                icon={originIcon}
                opacity={isDimmed ? 0.4 : 1}
                zIndexOffset={isSelected ? 1000 : 0}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <strong>Origin: {shipment.origin}</strong><br/>
                    {shipment.tracking_number}
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker 
                position={[shipment.dest_lat!, shipment.dest_lng!] as [number, number]} 
                icon={destIcon}
                opacity={isDimmed ? 0.4 : 1}
                zIndexOffset={isSelected ? 1000 : 0}
              >
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
                    color: isSelected ? '#ff0000' : getShipmentColor(shipment.status), 
                    weight: isSelected ? 4 : 2, 
                    dashArray: shipment.status === ShipmentStatus.PENDING && !isSelected ? '5, 10' : undefined,
                    opacity: isDimmed ? 0.1 : (isSelected ? 1 : 0.6)
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