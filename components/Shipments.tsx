import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { supabase } from '../supabaseClient';

interface ShipmentsProps {
  shipments: Shipment[];
  onDataUpdate: () => void;
}

// Simple dictionary for POC geocoding to avoid needing an external API key immediately
const PORT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Santos, BR': { lat: -23.9618, lng: -46.3322 },
  'Shanghai, CN': { lat: 31.2304, lng: 121.4737 },
  'Rotterdam, NL': { lat: 51.9225, lng: 4.47917 },
  'Lagos, NG': { lat: 6.5244, lng: 3.3792 },
  'Jacksonville, US': { lat: 30.3322, lng: -81.6557 },
  'San Juan, PR': { lat: 18.4655, lng: -66.1057 },
  'Busan, KR': { lat: 35.1796, lng: 129.0756 },
  'Tokyo, JP': { lat: 35.6762, lng: 139.6503 },
  'Atlanta, US': { lat: 33.7490, lng: -84.3880 },
  'Antwerp, BE': { lat: 51.2194, lng: 4.4025 },
  'Hong Kong, CN': { lat: 22.3193, lng: 114.1694 },
  'Singapore, SG': { lat: 1.3521, lng: 103.8198 },
  'Los Angeles, US': { lat: 34.0522, lng: -118.2437 },
  'New York, US': { lat: 40.7128, lng: -74.0060 },
};

export const Shipments: React.FC<ShipmentsProps> = ({ shipments, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    tracking_number: '',
    origin: 'Atlanta, US',
    destination: 'Rotterdam, NL',
    status: ShipmentStatus.PENDING,
    product_name: '',
    eta: '',
  });

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
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-Geocode lookup
    const originCoords = PORT_COORDINATES[newShipment.origin] || { lat: 0, lng: 0 };
    const destCoords = PORT_COORDINATES[newShipment.destination] || { lat: 0, lng: 0 };

    const { error } = await supabase.from('shipments').insert([{
      ...newShipment,
      origin_lat: originCoords.lat,
      origin_lng: originCoords.lng,
      dest_lat: destCoords.lat,
      dest_lng: destCoords.lng
    }]);

    if (error) {
      alert(`Error creating shipment: ${error.message}`);
    } else {
      setIsModalOpen(false);
      setNewShipment({
        tracking_number: '',
        origin: 'Atlanta, US',
        destination: 'Rotterdam, NL',
        status: ShipmentStatus.PENDING,
        product_name: '',
        eta: '',
      });
      onDataUpdate();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) {
        alert('Error deleting shipment');
      } else {
        onDataUpdate();
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipment Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor active logistics and estimated arrivals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
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
                      title="Delete Shipment"
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

      {/* Modal for Creating Shipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <i className="fas fa-ship text-ajc-blue"></i>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create New Shipment</h3>
                  <div className="mt-4">
                    <form onSubmit={handleCreateShipment} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                        <input
                          type="text"
                          required
                          value={newShipment.tracking_number}
                          onChange={(e) => setNewShipment({...newShipment, tracking_number: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          placeholder="SH-2024-XXX"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Origin</label>
                          <select
                            value={newShipment.origin}
                            onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          >
                             {Object.keys(PORT_COORDINATES).map(port => (
                               <option key={port} value={port}>{port}</option>
                             ))}
                          </select>
                        </div>
                         <div>
                          <label className="block text-sm font-medium text-gray-700">Destination</label>
                          <select
                            value={newShipment.destination}
                            onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          >
                             {Object.keys(PORT_COORDINATES).map(port => (
                               <option key={port} value={port}>{port}</option>
                             ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <input
                          type="text"
                          required
                          value={newShipment.product_name}
                          onChange={(e) => setNewShipment({...newShipment, product_name: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          placeholder="e.g. Poultry, Fries"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Status</label>
                           <select
                            value={newShipment.status}
                            onChange={(e) => setNewShipment({...newShipment, status: e.target.value as ShipmentStatus})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          >
                            {Object.values(ShipmentStatus).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ETA</label>
                          <input
                            type="date"
                            required
                            value={newShipment.eta}
                            onChange={(e) => setNewShipment({...newShipment, eta: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ajc-blue text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {loading ? 'Creating...' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
