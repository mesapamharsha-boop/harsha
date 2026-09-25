import { Request, Response } from 'express';
import { TestimonialModel } from '../models/index';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    let list = await TestimonialModel.find();
    if (all !== 'true') {
      list = list.filter(t => t.published !== false);
    }
    res.json({ success: true, count: list.length, testimonials: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve testimonials.' });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerRole, eventType, review, rating, photo, published } = req.body;
    if (!customerName || !review) {
      res.status(400).json({ success: false, message: 'Customer name and review are required.' });
      return;
    }

    const item = await TestimonialModel.create({
      customerName: customerName.trim(),
      customerRole: customerRole || 'Event Client',
      eventType: eventType || 'Special Occasion',
      review: review.trim(),
      rating: Number(rating) || 5,
      photo: photo || '',
      published: published !== undefined ? Boolean(published) : true,
    });

    res.status(201).json({ success: true, message: 'Testimonial created.', testimonial: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create testimonial.' });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await TestimonialModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return;
    }
    res.json({ success: true, message: 'Testimonial updated.', testimonial: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial.' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await TestimonialModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Testimonial not found.' });
      return;
    }
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete testimonial.' });
  }
};
