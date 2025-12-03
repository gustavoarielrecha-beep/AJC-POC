import React, { useMemo, Suspense, useState } from 'react';
import { Product, Shipment, ShipmentStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Lazy load the map to improve dashboard TTI (Time to Interactive)
const ShipmentMap = React.lazy(() => import('./ShipmentMap'));

interface DashboardProps {
  products: Product[];
  shipments: Shipment[];
  onViewFullMap: () => void;
}

const COLORS = ['#003366', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-xl shadow-xl text-sm border border-gray-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-blue-200">
          {payload[0].value} <span className="text-xs opacity-70">units</span>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ products, shipments, onViewFullMap }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + p.stock_level;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [products]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [shipments]);

  const stats = useMemo(() => ({
    totalStock: products.reduce((acc, curr) => acc + curr.stock_level, 0),
    activeShipments: shipments.filter(s => s.status === ShipmentStatus.IN_TRANSIT || s.status === ShipmentStatus.PENDING).length,
    delayedShipments: shipments.filter(s => s.status === ShipmentStatus.CUSTOMS).length,
    totalValue: products.length * 15000 // Estimated placeholder value
  }), [products, shipments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case ShipmentStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case ShipmentStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case ShipmentStatus.PENDING: return 'bg-gray-100 text-gray-600';
      case ShipmentStatus.CUSTOMS: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Overview</h1>
          <p className="text-gray-500 mt-1">Real-time insights into global logistics operations.</p>
        </div>
        <div className="flex gap-3">
          <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-600 shadow-sm border border-gray-100 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            System Operational
          </span>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-warehouse text-6xl text-ajc-blue"></i>
          </div>
          <div className="flex flex-col">
             <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Total Stock</p>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-800">{stats.totalStock.toLocaleString()}</p>
               <span className="text-xs font-medium text-gray-400">MT</span>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
               <i className="fas fa-arrow-up mr-1"></i> 2.4% vs last week
             </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-ship text-6xl text-blue-500"></i>
          </div>
          <div className="flex flex-col">
             <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Active Shipments</p>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-800">{stats.activeShipments}</p>
               <span className="text-xs font-medium text-gray-400">Containers</span>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-full">
               <i className="fas fa-sync mr-1"></i> Updated 5m ago
             </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-yellow-50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-exclamation-triangle text-6xl text-yellow-500"></i>
          </div>
          <div className="flex flex-col">
             <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Customs / Delayed</p>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-800">{stats.delayedShipments}</p>
               <span className="text-xs font-medium text-gray-400">Alerts</span>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-yellow-600 bg-yellow-50 w-fit px-2 py-1 rounded-full">
               Requires Attention
             </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-purple-50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-tags text-6xl text-purple-500"></i>
          </div>
          <div className="flex flex-col">
             <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Products Listed</p>
             <div className="flex items-baseline gap-2">
               <p className="text-3xl font-bold text-gray-800">{products.length}</p>
               <span className="text-xs font-medium text-gray-400">SKUs</span>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-purple-600 bg-purple-50 w-fit px-2 py-1 rounded-full">
               Full Catalog
             </div>
          </div>
        </div>
      </div>

      {/* Map & Shipments Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Column */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 flex flex-col h-[500px]">
          <div className="mb-4 flex items-center justify-between">
             <div>
                <h2 className="text-lg font-bold text-gray-800">Global Overview</h2>
                <p className="text-xs text-gray-500">Interactive shipment map</p>
             </div>
             <button 
               onClick={onViewFullMap}
               className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
             >
               <i className="fas fa-expand-alt mr-1"></i> Expand
             </button>
          </div>
          
          <div className="flex-grow w-full rounded-xl overflow-hidden relative bg-gray-50">
             <Suspense fallback={
               <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading map...
               </div>
             }>
               <ShipmentMap 
                  shipments={shipments} 
                  selectedShipmentId={selectedShipmentId}
               />
             </Suspense>
          </div>
        </div>

        {/* Shipments List Column */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 h-[500px] flex flex-col">
          <div className="mb-4">
             <h2 className="text-lg font-bold text-gray-800">Active Logistics</h2>
             <p className="text-xs text-gray-500">Select a shipment to view on map</p>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {shipments.map((shipment) => (
              <div 
                key={shipment.id}
                onClick={() => setSelectedShipmentId(selectedShipmentId === shipment.id ? null : shipment.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  selectedShipmentId === shipment.id 
                    ? 'border-ajc-blue bg-blue-50 ring-1 ring-ajc-blue' 
                    : 'border-gray-100 hover:border-blue-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {shipment.tracking_number}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                   <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Origin</span>
                      <span className="text-sm font-medium text-gray-800">{shipment.origin}</span>
                   </div>
                   <div className="flex flex-col items-center px-4">
                      <i className="fas fa-arrow-right text-gray-300"></i>
                      <span className="text-[10px] text-gray-400">{shipment.product_name}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Destination</span>
                      <span className="text-sm font-medium text-gray-800">{shipment.destination}</span>
                   </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100/50 flex justify-between items-center">
                   <span className="text-xs text-gray-400">
                     <i className="far fa-calendar mr-1"></i> ETA: {new Date(shipment.eta).toLocaleDateString()}
                   </span>
                   {selectedShipmentId === shipment.id && (
                     <span className="text-xs text-ajc-blue font-bold flex items-center animate-pulse">
                       Viewing on map <i className="fas fa-map-marker-alt ml-1"></i>
                     </span>
                   )}
                </div>
              </div>
            ))}
            {shipments.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <i className="fas fa-box-open text-3xl mb-2"></i>
                <p>No active shipments found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Inventory by Category</h2>
            <p className="text-sm text-gray-400">Metric tons per product category</p>
          </div>
          <div className="h-80 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                <Bar 
                  dataKey="value" 
                  fill="#003366" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">Shipment Status</h2>
            <p className="text-sm text-gray-400">Current distribution of logistics</p>
          </div>
          <div className="h-80 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-600 font-medium ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;