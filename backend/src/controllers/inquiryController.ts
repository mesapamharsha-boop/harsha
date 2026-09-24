import { Request, Response } from 'express';
import { InquiryModel } from '../models/index';
import { emailService } from '../services/emailService';

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, service, eventDate, city, venue, message } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400).json({ success: false, message: 'Name, email, phone, and message are required.' });
      return;
    }

    const inquiry = await InquiryModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service || 'General Inquiry',
      eventDate: eventDate || '',
      city: city || '',
      venue: venue || '',
      message: message.trim(),
      status: 'NEW',
    });

    emailService.sendNewInquiryAdminNotification({
      name,
      email,
      phone,
      service: service || 'General Inquiry',
      eventDate,
      city,
      venue,
      eventDetails: message,
    }).catch(err => console.error('[Email] Failed to send admin alert:', err));

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our team will contact you shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, q } = req.query;
    let all = await InquiryModel.find();

    if (status && typeof status === 'string' && status !== 'ALL') {
      all = all.filter(item => item.status === status);
    }
    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      all = all.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone.includes(search) ||
        (item.city && item.city.toLowerCase().includes(search)) ||
        (item.message && item.message.toLowerCase().includes(search))
      );
    }

    res.json({ success: true, count: all.length, inquiries: all });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
  }
};

export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await InquiryModel.findById(id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiry.' });
  }
};

export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await InquiryModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }
    res.json({ success: true, message: 'Inquiry updated successfully.', inquiry: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await InquiryModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
  }
};
