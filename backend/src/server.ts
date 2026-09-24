import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { ENV } from './config/env';
import { ROOT_DIR } from './database/db';
import { mongoConnection } from './database/connection';
import { corsMiddleware } from './middleware/cors';

// Import Routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import reelRoutes from './routes/reelRoutes';
import serviceRoutes from './routes/serviceRoutes';
import packageRoutes from './routes/packageRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import settingsRoutes from './routes/settingsRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import uploadRoutes from './routes/uploadRoutes';
import messageRoutes from './routes/messageRoutes';
import { seedDatabase } from './utils/seed';

export async function startServer() {
  const app = express();
  const PORT = ENV.PORT;

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // CORS Middleware
  app.use(corsMiddleware);

  // Body Parsing Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Ensure uploads directory exists and is statically served
  const uploadsDir = path.join(ROOT_DIR, 'public', 'uploads');
  const frontendUploadsDir = path.join(ROOT_DIR, 'frontend', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(frontendUploadsDir)) {
    fs.mkdirSync(frontendUploadsDir, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsDir));
  app.use('/uploads', express.static(frontendUploadsDir));

  // Step 3: Connect to MongoDB Atlas (with safe fallback if not configured)
  await mongoConnection.connect();

  // Step 4: Initialize and Seed Database if needed
  try {
    await seedDatabase();
  } catch (err) {
    console.error('[Startup] Seed verification error:', err);
  }

  // Step 5: Health API
  app.get('/api/health', (_req, res) => {
    const isConnected = mongoConnection.isConnected();
    if (isConnected) {
      res.status(200).json({
        success: true,
        server: 'ok',
        database: 'connected',
      });
    } else {
      res.status(200).json({
        success: false,
        server: 'ok',
        database: 'disconnected',
      });
    }
  });

  // API Route Prefix Normalization (handles any legacy /api/api/* requests transparently)
  app.use((req, _res, next) => {
    if (req.url.startsWith('/api/api/')) {
      req.url = req.url.replace(/^\/api\/api\//, '/api/');
    }
    next();
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/booking', bookingRoutes); // singular alias
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/inquiry', inquiryRoutes); // singular alias
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/reels', reelRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/messages', messageRoutes);

  // Fallback for missing API routes
  app.all('/api/*', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // Frontend Integration: Vite middleware in development vs Static serving in production
  const frontendDir = path.join(ROOT_DIR, 'frontend');
  const isStandaloneApi = process.env.STANDALONE_API === 'true';

  if (!isStandaloneApi) {
    if (process.env.NODE_ENV !== 'production' && fs.existsSync(frontendDir)) {
      const vite = await createViteServer({
        root: frontendDir,
        configFile: path.join(frontendDir, 'vite.config.ts'),
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      app.use('*', async (req, res, next) => {
        try {
          const url = req.originalUrl;
          let template = fs.readFileSync(path.join(frontendDir, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      const distPath = fs.existsSync(path.join(ROOT_DIR, 'dist', 'index.html'))
        ? path.join(ROOT_DIR, 'dist')
        : fs.existsSync(path.join(frontendDir, 'dist', 'index.html'))
        ? path.join(frontendDir, 'dist')
        : path.join(ROOT_DIR, 'dist');

      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LEOX Backend Server active on port ${PORT}`);
  });

  return app;
}

startServer().catch(err => {
  console.error('[Fatal] Server failed to start:', err);
  process.exit(1);
});
