import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyAedD8WaMU7Ws7-tQRjm8YQZktRL-RfqsU"),
  },
  server: {
    host: '0.0.0.0',
    port: 3005,
    allowedHosts: ['usdcfscmdswrmt1.ajc.bz', 'localhost', '127.0.0.1'],
  },
});