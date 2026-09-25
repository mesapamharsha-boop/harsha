import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin as string | undefined;

  // Allowed origins configured via env or localhost defaults
  const configuredOrigins = ENV.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean);
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
  const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

  if (origin) {
    // Check if origin is allowed or running on development domain
    const isAllowed = allowedOrigins.includes(origin) || 
      origin.endsWith('.run.app') || 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1');

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type-Options');

  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
};
