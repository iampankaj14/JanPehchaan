import { Router, Request, Response } from 'express';
import { isSupabaseConfigured } from '../config/supabase';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    project: 'JanPehchaan Backend API',
    tagline: 'Aapki Pehchaan, Aapka Adhikaar',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database_mode: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Demo Store (In-Memory)',
    uptime_seconds: Math.floor(process.uptime())
  });
});

export default router;
