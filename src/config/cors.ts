import { CorsOptions } from 'cors';
import { env } from './env.js';

const configuredOrigins = (env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const isProduction = process.env.NODE_ENV === 'production';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps, server-to-server health checks)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, '');

    // In local development, permit all origins (any port on localhost, 127.0.0.1, LAN IPs, tunnels)
    if (!isProduction) {
      return callback(null, true);
    }

    if (
      configuredOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      devOrigins.includes(cleanOrigin)
    ) {
      return callback(null, true);
    }

    // Reject unknown origins in production cleanly without throwing a 500 error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-password',
    'x-device-fingerprint',
    'x-author-tag',
    'Access-Control-Request-Private-Network',
    'Access-Control-Allow-Private-Network'
  ]
};
