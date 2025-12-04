import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Product, ProductCategory } from '../types';

interface InventoryProps {
  products: Product[];
  onDataUpdate: () => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onDataUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.POULTRY);
  const [stockLevel, setStockLevel] = useState(0);
  const [unit, setUnit] = useState('MT');
  const [location, setLocation] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('products')
      .insert([
        { name, category, stock_level: stockLevel, unit, location }
      ]);

    setLoading(false);
    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      setShowModal(false);
      resetForm();
      onDataUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) alert('Error deleting product: ' + error.message);
    else onDataUpdate();
  };

  const resetForm = () => {
    setName('');
    setCategory(ProductCategory.POULTRY);
    setStockLevel(0);
    setUnit('MT');
    setLocation('');
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Global Inventory</h1>
          <p className="text-gray-500 mt-1">Manage stock levels across international warehouses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-ajc-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 font-medium flex items-center"
        >
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
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors bg-transparent p-2 rounded-full hover:bg-red-50"
                    >
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

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Add New Product</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                  placeholder="e.g. Frozen Chicken Legs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all bg-white"
                  >
                    {Object.values(ProductCategory).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input 
                    type="text" 
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                    placeholder="MT, KG, Box"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                  <input 
                    type="number" 
                    value={stockLevel}
                    onChange={e => setStockLevel(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-ajc-blue focus:border-ajc-blue outline-none transition-all"
                    placeholder="Warehouse / Port"
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
                  {loading ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;