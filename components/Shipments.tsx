import React from 'react';
import { Shipment, ShipmentStatus } from '../types';

interface ShipmentsProps {
  shipments: Shipment[];
}

const Shipments: React.FC<ShipmentsProps> = ({ shipments }) => {
  
  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-800';
      case ShipmentStatus.DELIVERED: return 'bg-green-100 text-green-800';
      case ShipmentStatus.PENDING: return 'bg-gray-100 text-gray-800';
      case ShipmentStatus.CUSTOMS: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Shipment Tracking</h1>
        <button className="bg-ajc-blue hover:bg-blue-800 text-white px-4 py-2 rounded shadow transition">
          <i className="fas fa-shipping-fast mr-2"></i> Create Shipment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                  {shipment.tracking_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {shipment.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {shipment.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {shipment.product_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(shipment.eta).toLocaleDateString()}
                </td>
              </tr>
            ))}
             {shipments.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">No shipments found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipments;