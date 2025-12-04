import React from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
}

const Inventory: React.FC<InventoryProps> = ({ products }) => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Global Inventory</h1>
          <p className="text-gray-500 mt-1">Manage stock levels across international warehouses</p>
        </div>
        <button className="bg-ajc-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 font-medium flex items-center">
          <i className="fas fa-plus mr-2 text-sm"></i> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-ajc-blue mr-4">
                        <i className="fas fa-box-open"></i>
                      </div>
                      <div className="text-sm font-bold text-gray-800 group-hover:text-ajc-blue transition-colors">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                       <i className="fas fa-map-marker-alt text-gray-300"></i>
                       {product.location}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{product.stock_level.toLocaleString()}</div>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {product.unit}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-ajc-blue transition-colors mr-4 bg-transparent p-2 rounded-full hover:bg-gray-100">
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="text-gray-400 hover:text-red-600 transition-colors bg-transparent p-2 rounded-full hover:bg-red-50">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                  <tr>
                      <td colSpan={6} className="text-center p-12 text-gray-400">
                        <i className="fas fa-inbox text-4xl mb-3 block opacity-20"></i>
                        No products found in inventory.
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

export default Inventory;