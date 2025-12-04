import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Logic to read API Key from Docker Secret or fallback to env var/hardcoded
let apiKey = process.env.API_KEY || "";

// Check if the secret file path is provided via environment variable
const secretFilePath = process.env.AI_API_KEY_FILE;

if (secretFilePath) {
  try {
    if (fs.existsSync(secretFilePath)) {
      // Read the secret from the file and trim whitespace/newlines
      apiKey = fs.readFileSync(secretFilePath, 'utf-8').trim();
      console.log('Successfully loaded API Key from Docker Secret.');
    } else {
      console.warn(`Secret file not found at: ${secretFilePath}`);
    }
  } catch (err) {
    console.error('Error reading secret file:', err);
  }
}

// Fallback for local dev if secret not present (Optional: keep hardcoded for local dev ease, or remove for strict security)
if (!apiKey) {
    // Fallback solely for demonstration if secret setup is skipped locally
    apiKey = "AIzaSyAedD8WaMU7Ws7-tQRjm8YQZktRL-RfqsU"; 
    console.warn("Using fallback/hardcoded API Key. Ensure secrets are configured in production.");
}

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject the resolved apiKey into the frontend code
    'process.env.API_KEY': JSON.stringify(apiKey),
    'process.env': {},
  },
  server: {
    host: '0.0.0.0',
    port: 3005,
    hmr: {
        overlay: false,
    },
    https: {
      key: fs.readFileSync('./cert_ajc.key'),
      cert: fs.readFileSync('./cert_ajc.crt'),
    },
    allowedHosts: ['usdcfscmdswrmt1.ajc.bz', 'localhost', '127.0.0.1'],
  },
});