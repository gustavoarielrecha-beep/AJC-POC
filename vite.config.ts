import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Logic to read API Key from Docker Secret or fallback to env var
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
      console.warn(`Secret file configured at ${secretFilePath} but file does not exist.`);
    }
  } catch (err) {
    console.error('Error reading secret file:', err);
  }
}

if (!apiKey) {
    console.warn("WARNING: No API Key found in Docker Secret or Environment Variables. AI features will not work.");
}

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject the resolved apiKey into the frontend code
    'process.env.API_KEY': JSON.stringify(apiKey),
    // Define process.env to prevent ReferenceError in some libraries
    'process.env': {},
  },
  server: {
    host: '0.0.0.0',
    hmr: {
        overlay: false,
    },
    allowedHosts: ['usdcfscmdswrmt1.ajc.bz', 'localhost', '127.0.0.1'],
  },
});