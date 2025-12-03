import React from 'react';
import { supabase } from '../supabaseClient';
import { Profile } from '../types';

interface NavbarProps {
  session: any;
  profile: Profile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ session, profile, activeTab, setActiveTab }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-ajc-blue text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-2xl tracking-wider">
              AJC <span className="text-red-500 text-sm align-top">POC</span>
            </div>
            {session && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'inventory' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setActiveTab('shipments')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'shipments' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    Logistics
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-right hidden sm:block">
                  <p className="font-semibold">{profile.full_name}</p>
                  <p className="text-xs text-gray-300 capitalize">{profile.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  {profile.full_name?.charAt(0) || 'U'}
                </div>
              </div>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-sm transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {session && (
        <div className="md:hidden flex justify-around bg-blue-900 p-2">
           <button onClick={() => setActiveTab('dashboard')} className={`p-2 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`}><i className="fas fa-chart-line"></i></button>
           <button onClick={() => setActiveTab('inventory')} className={`p-2 ${activeTab === 'inventory' ? 'text-white' : 'text-gray-400'}`}><i className="fas fa-boxes"></i></button>
           <button onClick={() => setActiveTab('shipments')} className={`p-2 ${activeTab === 'shipments' ? 'text-white' : 'text-gray-400'}`}><i className="fas fa-ship"></i></button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;