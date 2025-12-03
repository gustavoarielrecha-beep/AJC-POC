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
    <nav className="bg-white shadow-card sticky top-0 z-50 backdrop-blur-md bg-opacity-90 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 font-bold text-2xl tracking-tight text-ajc-blue">
              AJC <span className="text-ajc-red text-sm font-extrabold px-1.5 py-0.5 bg-red-50 rounded-md align-top ml-1">POC</span>
            </div>
            {session && (
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === 'dashboard' 
                        ? 'bg-ajc-blue text-white shadow-lg shadow-blue-900/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-ajc-blue'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === 'map' 
                        ? 'bg-ajc-blue text-white shadow-lg shadow-blue-900/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-ajc-blue'
                    }`}
                  >
                    Global Map
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === 'inventory' 
                        ? 'bg-ajc-blue text-white shadow-lg shadow-blue-900/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-ajc-blue'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setActiveTab('shipments')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === 'shipments' 
                        ? 'bg-ajc-blue text-white shadow-lg shadow-blue-900/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-ajc-blue'
                    }`}
                  >
                    Logistics
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            {profile && (
              <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                <div className="text-sm text-right hidden sm:block">
                  <p className="font-bold text-gray-800 leading-none mb-1">{profile.full_name}</p>
                  <p className="text-xs text-gray-400 font-medium capitalize tracking-wide">{profile.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-ajc-blue flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">
                  {profile.full_name?.charAt(0) || 'U'}
                </div>
              </div>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Sign Out"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {session && (
        <div className="md:hidden flex justify-around bg-white border-t border-gray-100 p-2 fixed bottom-0 w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <button onClick={() => setActiveTab('dashboard')} className={`p-4 rounded-xl flex flex-col items-center ${activeTab === 'dashboard' ? 'text-ajc-blue' : 'text-gray-400'}`}>
             <i className="fas fa-chart-line text-lg mb-1"></i>
             <span className="text-[10px] font-bold">Dash</span>
           </button>
           <button onClick={() => setActiveTab('map')} className={`p-4 rounded-xl flex flex-col items-center ${activeTab === 'map' ? 'text-ajc-blue' : 'text-gray-400'}`}>
             <i className="fas fa-globe-americas text-lg mb-1"></i>
             <span className="text-[10px] font-bold">Map</span>
           </button>
           <button onClick={() => setActiveTab('inventory')} className={`p-4 rounded-xl flex flex-col items-center ${activeTab === 'inventory' ? 'text-ajc-blue' : 'text-gray-400'}`}>
             <i className="fas fa-boxes text-lg mb-1"></i>
             <span className="text-[10px] font-bold">Stock</span>
           </button>
           <button onClick={() => setActiveTab('shipments')} className={`p-4 rounded-xl flex flex-col items-center ${activeTab === 'shipments' ? 'text-ajc-blue' : 'text-gray-400'}`}>
             <i className="fas fa-ship text-lg mb-1"></i>
             <span className="text-[10px] font-bold">Ship</span>
           </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;