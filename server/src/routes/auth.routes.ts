import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().trim().optional()
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const resetPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await AuthService.register(input.name, input.email, input.password, input.phone);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please sign in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: error.errors[0]?.message || 'Invalid input' });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const { token, user } = await AuthService.login(input.email, input.password);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: error.errors[0]?.message || 'Invalid credentials' });
      return;
    }
    res.status(401).json({ success: false, message: error.message || 'Incorrect email or password' });
  }
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const input = resetPasswordSchema.parse(req.body);
    await AuthService.resetPassword(input.email, input.newPassword);
    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in.'
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, message: error.errors[0]?.message || 'Invalid input' });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Password reset failed' });
  }
});

router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
