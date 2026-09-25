import { Request, Response } from 'express';
import { PortfolioModel } from '../models/index';

export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured, city, all } = req.query;
    let list = await PortfolioModel.find();

    // Unless 'all=true' is explicitly requested (e.g. from admin), show only published
    if (all !== 'true') {
      list = list.filter(p => p.published !== false);
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      list = list.filter(p => p.featured === true);
    }

    if (city && typeof city === 'string' && city !== 'ALL') {
      list = list.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
    }

    res.json({ success: true, count: list.length, projects: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve portfolio projects.' });
  }
};

export const getPortfolioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await PortfolioModel.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Portfolio project not found.' });
      return;
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve project.' });
  }
};

export const createPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      description,
      city,
      venue,
      eventDate,
      coverImage,
      galleryImages,
      videoUrl,
      instagramUrl,
      featured,
      published,
      clientName,
    } = req.body;

    if (!title || !category || !city || !venue || !coverImage) {
      res.status(400).json({
        success: false,
        message: 'Project title, category, city, venue, and cover image are required.',
      });
      return;
    }

    const newProject = await PortfolioModel.create({
      title: title.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      city: city.trim(),
      venue: venue.trim(),
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      coverImage: coverImage.trim(),
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      videoUrl: videoUrl ? videoUrl.trim() : '',
      instagramUrl: instagramUrl ? instagramUrl.trim() : 'https://www.instagram.com/leox_shoots/',
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      clientName: clientName || '',
    });

    res.status(201).json({ success: true, message: 'Project created successfully.', project: newProject });
  } catch (error) {
    console.error('[Portfolio] Creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create portfolio project.' });
  }
};

export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await PortfolioModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Portfolio project not found.' });
      return;
    }
    res.json({ success: true, message: 'Project updated successfully.', project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update portfolio project.' });
  }
};

export const deletePortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await PortfolioModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Portfolio project not found.' });
      return;
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete portfolio project.' });
  }
};
