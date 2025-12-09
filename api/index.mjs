/**
 * Vercel serverless function for Angular SSR
 * Handles all routes and lets Angular router decide what to render
 * Based on app.routes.server.ts configuration:
 * - Prerendered routes: served from static files (faster)
 * - Server routes: rendered on-demand (fresh content)
 */
import { createNodeRequestHandler } from '@angular/ssr/node';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverDistFolder = resolve(__dirname, '../dist/e2e-portfolio/server');
const browserDistFolder = resolve(__dirname, '../dist/e2e-portfolio/browser');

// Create Angular SSR handler - handles all routes
// Angular will check app.routes.server.ts to determine render mode
const handler = createNodeRequestHandler({
  serverDistFolder,
  browserDistFolder,
});

export default handler;

