import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Profile, Product, Shipment } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Shipments from './components/Shipments';
import Auth from './components/Auth';
import AJCBot from './components/AJCBot';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileData) setProfile(profileData as Profile);

    // Fetch Business Data
    fetchBusinessData();
  };

  const fetchBusinessData = async () => {
    const { data: prodData } = await supabase.from('products').select('*');
    if (prodData) setProducts(prodData as Product[]);

    const { data: shipData } = await supabase.from('shipments').select('*');
    if (shipData) setShipments(shipData as Shipment[]);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-ajc-blue"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar 
        session={session} 
        profile={profile} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-grow pb-20">
        {activeTab === 'dashboard' && <Dashboard products={products} shipments={shipments} />}
        {activeTab === 'inventory' && <Inventory products={products} />}
        {activeTab === 'shipments' && <Shipments shipments={shipments} />}
      </main>

      <AJCBot />
      
      <footer className="bg-gray-800 text-white py-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} AJC International. All Rights Reserved. | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default App;