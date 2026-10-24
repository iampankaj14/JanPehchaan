import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matched origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Access blocked from this origin.'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Information Route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    project: 'JanPehchaan',
    tagline: 'Aapki Pehchaan, Aapka Adhikaar',
    description: 'Unified Citizen & Family Records and Welfare Entitlement Guidance Platform',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      families: '/api/families',
      verification: '/api/verification/check/:familyId',
      schemes: '/api/schemes',
      schemeEvaluation: '/api/schemes/evaluate/:familyId',
      reviews: '/api/reviews'
    }
  });
});

// Mount All API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start HTTP Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  JanPehchaan Backend API is running on port ${PORT}`);
    console.log(`  Tagline: "Aapki Pehchaan, Aapka Adhikaar"`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Families API: http://localhost:${PORT}/api/families`);
    console.log(`=======================================================`);
  });
}

export default app;
