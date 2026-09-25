import { Request, Response } from 'express';
import { ServiceModel } from '../models/index';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    let list = await ServiceModel.find();
    if (all !== 'true') {
      list = list.filter(s => s.published !== false);
    }
    res.json({ success: true, count: list.length, services: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceName, slug, description, startingPrice, duration, image, deliverables, featured, published } = req.body;
    if (!serviceName || !description) {
      res.status(400).json({ success: false, message: 'Service name and description are required.' });
      return;
    }

    const service = await ServiceModel.create({
      serviceName: serviceName.trim(),
      slug: slug || serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      startingPrice: startingPrice || 'Contact for Quote',
      duration: duration || 'Half-Day / Full-Day',
      image: image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200',
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
    });

    res.status(201).json({ success: true, message: 'Service created successfully.', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await ServiceModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, message: 'Service updated.', service: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ServiceModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};
