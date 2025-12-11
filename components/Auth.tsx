import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else setMessage('Registration successful! Please check your email for confirmation.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'github' | 'google' | 'facebook') => {
    // IMPORTANT: 
    // 1. "https://usdcfscmdswrmt1.ajc.bz:3005" MUST be added to Supabase Dashboard > Auth > URL Configuration > Redirect URLs
    // 2. If this fails and goes to localhost:3000, it means Supabase rejected this URL and fell back to the default Site URL.
    
    // We prefer the specific production domain if available, otherwise fallback to window location
    const targetUrl = 'https://usdcfscmdswrmt1.ajc.bz:3005';
    
    console.log(`Authenticating with ${provider}. Redirecting to: ${targetUrl}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: targetUrl,
      }
    });

    if (error) {
        console.error("OAuth Error:", error);
        setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajc-blue to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-ajc-blue mb-2">AJC International</h1>
            <p className="text-gray-500">Unified Logistics Portal</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="you@ajcgroup.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="••••••••"
            />
          </div>
          
          {message && <p className="text-sm text-center text-red-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => handleOAuth('github')}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <i className="fab fa-github mr-2 text-lg"></i> GitHub
            </button>
            <button 
                onClick={() => handleOAuth('facebook')}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <i className="fab fa-facebook mr-2 text-lg text-blue-600"></i> Facebook
            </button>
            <button 
                onClick={() => handleOAuth('google')}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 col-span-2"
            >
                <i className="fab fa-google mr-2 text-lg text-red-500"></i> Google
            </button>
        </div>

        <div className="text-center">
            <button 
                onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
                className="text-sm text-blue-600 hover:text-blue-500"
            >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;