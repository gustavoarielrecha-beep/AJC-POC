import React, { useMemo } from 'react';
import { Product, Shipment, ShipmentStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  products: Product[];
  shipments: Shipment[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ products, shipments }) => {
  
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Executive Overview</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 uppercase font-semibold">Total Stock (MT)</p>
               <p className="text-2xl font-bold text-gray-800">{stats.totalStock.toLocaleString()}</p>
             </div>
             <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
               <i className="fas fa-warehouse"></i>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 uppercase font-semibold">Active Shipments</p>
               <p className="text-2xl font-bold text-gray-800">{stats.activeShipments}</p>
             </div>
             <div className="text-green-500 bg-green-100 p-3 rounded-full">
               <i className="fas fa-ship"></i>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 uppercase font-semibold">Delayed / Customs</p>
               <p className="text-2xl font-bold text-gray-800">{stats.delayedShipments}</p>
             </div>
             <div className="text-yellow-500 bg-yellow-100 p-3 rounded-full">
               <i className="fas fa-exclamation-triangle"></i>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 uppercase font-semibold">Products Listed</p>
               <p className="text-2xl font-bold text-gray-800">{products.length}</p>
             </div>
             <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
               <i className="fas fa-tags"></i>
             </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Inventory Distribution (MT)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#003366" name="Metric Tons" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Shipment Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;