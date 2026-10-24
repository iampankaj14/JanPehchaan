import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../types';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'janpehchaan-super-secret-key-2026-hackathon';

// Pre-seeded Demo Accounts
const initialUsers: User[] = [
  {
    id: 'user_admin_01',
    name: 'Pankaj Kumar (Admin)',
    email: 'admin@janpehchaan.gov.in',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'ADMIN',
    phone: '9876543210',
    active: true,
    created_at: '2026-10-20T10:00:00Z'
  },
  {
    id: 'user_officer_02',
    name: 'Ayush Pal (Verification Officer)',
    email: 'officer@janpehchaan.gov.in',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'OFFICER',
    phone: '9876543211',
    active: true,
    created_at: '2026-10-20T10:00:00Z'
  },
  {
    id: 'user_citizen_03',
    name: 'Ramesh Kumar Sharma',
    email: 'citizen@janpehchaan.in',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'CITIZEN',
    phone: '9876543212',
    active: true,
    created_at: '2026-10-20T10:00:00Z'
  }
];

let usersStore: User[] = JSON.parse(JSON.stringify(initialUsers));

export class AuthService {
  static async findUserByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    return usersStore.find(u => u.email.toLowerCase() === normalized && u.active) || null;
  }

  static async findUserById(id: string): Promise<User | null> {
    return usersStore.find(u => u.id === id && u.active) || null;
  }

  static async register(name: string, email: string, password: string, phone?: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new Error('Email address is already registered.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: `user_${randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'CITIZEN',
      phone: phone?.trim(),
      active: true,
      created_at: new Date().toISOString()
    };

    usersStore.push(newUser);
    return newUser;
  }

  static async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Incorrect email or password.');
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      throw new Error('Incorrect email or password.');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  static async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('No registered account found with this email.');
    }
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    return true;
  }

  static getUsersCount(): number {
    return usersStore.length;
  }
}
