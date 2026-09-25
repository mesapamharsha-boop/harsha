import { Request, Response } from 'express';
import { MessageModel } from '../models/index';
import { emailService } from '../services/emailService';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, service, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      return;
    }

    const newMessage = await MessageModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      service: service ? service.trim() : 'General Enquiry',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      isRead: false,
    });

    emailService.sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      service: service ? service.trim() : 'General Enquiry',
      subject: subject ? subject.trim() : 'New Contact Submission',
      message: message.trim(),
    }).catch(err => console.error('[Email] Failed to notify admin of message:', err));

    res.status(201).json({
      success: true,
      message: "Thank you! Your enquiry has been received. We'll get back to you shortly.",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

export const getMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await MessageModel.find();
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

export const markMessageRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await MessageModel.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: 'Marked as read.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message.' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await MessageModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};
