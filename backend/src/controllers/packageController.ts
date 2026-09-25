import { Request, Response } from 'express';
import { PackageModel } from '../models/index';

export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { all } = req.query;
    let list = await PackageModel.find();
    if (all !== 'true') {
      list = list.filter(p => p.published !== false);
    }
    res.json({ success: true, count: list.length, packages: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve packages.' });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { packageName, slug, description, price, duration, includedServices, featured, popular, published } = req.body;
    if (!packageName || !price) {
      res.status(400).json({ success: false, message: 'Package name and price are required.' });
      return;
    }

    const pkg = await PackageModel.create({
      packageName: packageName.trim(),
      slug: slug || packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description ? description.trim() : '',
      price: price.trim(),
      duration: duration || 'Per Event',
      includedServices: Array.isArray(includedServices) ? includedServices : [],
      featured: Boolean(featured),
      popular: Boolean(popular),
      published: published !== undefined ? Boolean(published) : true,
    });

    res.status(201).json({ success: true, message: 'Package created successfully.', package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create package.' });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await PackageModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }
    res.json({ success: true, message: 'Package updated.', package: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update package.' });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await PackageModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }
    res.json({ success: true, message: 'Package deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete package.' });
  }
};
