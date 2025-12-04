import React from 'react';
import { Shipment, ShipmentStatus } from '../types';

interface ShipmentsProps {
  shipments: Shipment[];
}

const Shipments: React.FC<ShipmentsProps> = ({ shipments }) => {
  
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

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipment Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor active logistics and estimated arrivals</p>
        </div>
        <button className="bg-ajc-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 font-medium flex items-center">
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
                <th className="px-6 py-5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
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
                    <button className="text-gray-400 hover:text-ajc-blue p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <i className="fas fa-ellipsis-v"></i>
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
    </div>
    </div>
  );
};

export default Shipments;