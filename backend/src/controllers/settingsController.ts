import { Request, Response } from 'express';
import { SettingsModel } from '../models/index';

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await SettingsModel.get();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve site settings.' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await SettingsModel.update(req.body);
    res.json({ success: true, message: 'Settings saved successfully.', settings: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update site settings.' });
  }
};
