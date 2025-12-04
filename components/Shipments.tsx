import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Shipment, ShipmentStatus } from '../types';

interface ShipmentsProps {
  shipments: Shipment[];
  onDataUpdate: () => void;
}

// Simple Coordinate Dictionary for POC Auto-Geocoding
const PORT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Santos, BR': { lat: -23.9618, lng: -46.3322 },
  'Shanghai, CN': { lat: 31.2304, lng: 121.4737 },
  'Rotterdam, NL': { lat: 51.9225, lng: 4.47917 },
  'Lagos, NG': { lat: 6.5244, lng: 3.3792 },
  'Jacksonville, US': { lat: 30.3322, lng: -81.6557 },
  'San Juan, PR': { lat: 18.4655, lng: -66.1057 },
  'Busan, KR': { lat: 35.1796, lng: 129.0756 },
  'Tokyo, JP': { lat: 35.6762, lng: 139.6503 },
  'Antwerp, BE': { lat: 51.2194, lng: 4.4025 },
  'Singapore, SG': { lat: 1.3521, lng: 103.8198 },
  'Dubai, AE': { lat: 25.2048, lng: 55.2708 },
  'Hamburg, DE': { lat: 53.5511, lng: 9.9937 },
  'Los Angeles, US': { lat: 33.7455, lng: -118.2587 },
  'Savannah, US': { lat: 32.0809, lng: -81.0912 }
};

export const Shipments: React.FC<ShipmentsProps> = ({ shipments, onDataUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [productName, setProductName] = useState('');
  const [status, setStatus] = useState<ShipmentStatus>(ShipmentStatus.PENDING);
  const [eta, setEta] = useState('');

  const getStatusStyles = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.IN_TRANSIT: 
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
      case ShipmentStatus.DELIVERED: 
        return 'bg-green-50 text-green-700 border-green-200 ring-green-100';
      case ShipmentStatus.PENDING: 
        return 'bg-gray-50 text-gray-600 border-gray-200 ring-gray-100';
      case ShipmentStatus.CUSTOMS: 
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100';
      default: 
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
        case ShipmentStatus.IN_TRANSIT: return 'fa-truck-moving';
        case ShipmentStatus.DELIVERED: return 'fa-check-circle';
        case ShipmentStatus.PENDING: return 'fa-clock';
        case ShipmentStatus.CUSTOMS: return 'fa-hand-paper';
        default: return 'fa-circle';
    }
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-Geocode based on dictionary
    const originCoords = PORT_COORDINATES[origin] || { lat: 0, lng: 0 };
    const destCoords = PORT_COORDINATES[destination] || { lat: 0, lng: 0 };

    const { error } = await supabase
      .from('shipments')
      .insert([{
        tracking_number: trackingNumber,
        origin,
        destination,
        product_name: productName,
        status,
        eta,
        origin_lat: originCoords.lat !== 0 ? originCoords.lat : null,
        origin_lng: originCoords.lng !== 0 ? originCoords.lng : null,
        dest_lat: destCoords.lat !== 0 ? destCoords.lat : null,
        dest_lng: destCoords.lng !== 0 ? destCoords.lng : null
      }]);

    setLoading(false);
    if (error) {
      alert('Error creating shipment: ' + error.message);
    } else {
      setShowModal(false);
      resetForm();
      onDataUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this shipment?')) return;
    
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);

    if (error) alert('Error: ' + error.message);
    else onDataUpdate();
  };

  const resetForm = () => {
    setTrackingNumber('');
    setOrigin('');
    setDestination('');
    setProductName('');
    setStatus(ShipmentStatus.PENDING);
    setEta('');
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipment Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor active logistics and estimated arrivals</p>
        </div>
        <button 
          onClick={() => {
            setTrackingNumber(`SH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
            setShowModal(true);
          }}
          className="bg-ajc-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 font-medium flex items-center"
        >
          <i className="fas fa-plus mr-2 text-sm"></i> Create Shipment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ETA</th>
                <th className="px-6 py-5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <i className="fas fa-barcode"></i>
                        </div>
                        <span className="font-mono text-sm font-medium text-ajc-blue">{shipment.tracking_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-gray-900">{shipment.origin}</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <i className="fas fa-arrow-down text-[10px]"></i> 
                        {shipment.destination}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {shipment.product_name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full border ${getStatusStyles(shipment.status)}`}>
                      <i className={`fas ${getStatusIcon(shipment.status)} mr-2 text-[10px]`}></i>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <i className="far fa-calendar-alt text-gray-300"></i>
                        {new Date(shipment.eta).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => handleDelete(shipment.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
             {shipments.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-12 text-gray-400">
                        <i className="fas fa-ship text-4xl mb-3 block opacity-20"></i>
                        No active shipments found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Create New Shipment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateShipment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 font-mono text-gray-500"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Origin Port</label>
                   <select 
                     value={origin}
                     onChange={e => setOrigin(e.target.value)}
                     className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all bg-white"
                     required
                   >
                     <option value="">Select Origin...</option>
                     {Object.keys(PORT_COORDINATES).map(port => (
                       <option key={`origin-${port}`} value={port}>{port}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                   <select 
                     value={destination}
                     onChange={e => setDestination(e.target.value)}
                     className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all bg-white"
                     required
                   >
                     <option value="">Select Destination...</option>
                     {Object.keys(PORT_COORDINATES).map(port => (
                       <option key={`dest-${port}`} value={port}>{port}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                  placeholder="e.g. Frozen Poultry Container"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select 
                     value={status}
                     onChange={e => setStatus(e.target.value as ShipmentStatus)}
                     className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all bg-white"
                   >
                     {Object.values(ShipmentStatus).map(s => (
                       <option key={s} value={s}>{s}</option>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                  <input 
                    type="date" 
                    value={eta}
                    onChange={e => setEta(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-ajc-blue text-white font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-70"
                >
                  {loading ? 'Creating...' : 'Create Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
