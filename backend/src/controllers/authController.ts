import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/index';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'leox_jwt_super_secret_production_key_2026';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = (email || username || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      res.status(400).json({ success: false, message: 'Please provide both username/email and password.' });
      return;
    }

    const admin = await AdminModel.findOne({ email: loginIdentifier });
    if (!admin || !admin.password) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check your username and password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check your username and password.' });
      return;
    }

    // Update last login
    await AdminModel.findByIdAndUpdate(admin.id || admin._id!, {
      lastLogin: new Date().toISOString(),
    });

    const token = jwt.sign(
      {
        id: admin.id || admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin.id || admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const admin = await AdminModel.findById(req.admin.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found.' });
      return;
    }

    res.json({
      success: true,
      admin: {
        id: admin.id || admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current password and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const admin = await AdminModel.findById(req.admin.id);
    if (!admin || !admin.password) {
      res.status(404).json({ success: false, message: 'Admin account not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password does not match.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await AdminModel.findByIdAndUpdate(admin.id || admin._id!, {
      password: hashedPassword,
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[Auth] Change password error:', err);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
