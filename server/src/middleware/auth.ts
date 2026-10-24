import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload || !payload.sub) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
    return;
  }

  const user = await AuthService.findUserById(payload.sub);
  if (!user || !user.active) {
    res.status(401).json({ success: false, message: 'User account unavailable or inactive.' });
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  next();
};

export const allowRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to perform this action.'
      });
      return;
    }
    next();
  };
};
