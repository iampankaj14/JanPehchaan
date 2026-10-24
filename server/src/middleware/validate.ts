import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const rawIssues: any[] = (error as any).issues || (error as any).errors || [];
        const issues = rawIssues.map(err => ({
          field: Array.isArray(err.path) ? err.path.join('.') : String(err.path || ''),
          message: err.message
        }));
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: issues
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: 'Malformed request payload'
      });
    }
  };
};
