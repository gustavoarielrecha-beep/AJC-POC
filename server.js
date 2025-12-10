import { createServer } from 'vite';
import http from 'http';
import https from 'https';
import fs from 'fs';

const PORT_HTTP = 3005;
const PORT_HTTPS = 3006;

(async () => {
  try {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    const app = vite.middlewares;

    // HTTP Server
    const httpServer = http.createServer(app);
    httpServer.listen(PORT_HTTP, '0.0.0.0', () => {
      console.log(`HTTP Server running at http://0.0.0.0:${PORT_HTTP}`);
    });

    // HTTPS Server
    if (fs.existsSync('cert_ajc.key') && fs.existsSync('cert_ajc.crt')) {
      const httpsOptions = {
        key: fs.readFileSync('cert_ajc.key'),
        cert: fs.readFileSync('cert_ajc.crt'),
      };
      const httpsServer = https.createServer(httpsOptions, app);
      httpsServer.listen(PORT_HTTPS, '0.0.0.0', () => {
        console.log(`HTTPS Server running at https://0.0.0.0:${PORT_HTTPS}`);
      });
    } else {
      console.warn('SSL certificates not found. Skipping HTTPS server.');
    }
  } catch (e) {
    console.error('Error starting server:', e);
    process.exit(1);
  }
})();