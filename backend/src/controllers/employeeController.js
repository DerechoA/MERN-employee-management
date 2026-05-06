import { models, modelDefinitions } from '../models/models.js';
import User from '../models/User.js';
import { body, param, validationResult } from 'express-validator';

const resolveModelConfig = (modelParam) => {
  const slug = modelParam.toLowerCase();
  const config = modelDefinitions[slug];
  if (!config) return null;
  return {
    config,
    Model: models[config.modelName],
  };
};

// Validation rules for different models
const getValidationRules = (modelName, isUpdate = false) => {
  const rules = [];

  if (modelName === 'employees') {
    rules.push(
      body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
      body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
      body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
      body('position').trim().isLength({ min: 1 }).withMessage('Position is required'),
      body('department').trim().isLength({ min: 1 }).withMessage('Department is required'),
      body('salary').notEmpty().withMessage('Salary is required').isFloat({ min: 0 }).withMessage('Salary must be a positive number')
    );
  }

  return rules;
};

export const validateModel = (modelName, isUpdate = false) => {
  return [
    ...getValidationRules(modelName, isUpdate),
    param('model').isIn(Object.keys(modelDefinitions)).withMessage('Invalid model'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      next();
    }
  ];
};

export const getModelDefinition = (req, res) => {
  const resolved = resolveModelConfig(req.params.model);
  if (!resolved) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const { config } = resolved;
  res.json({ modelName: config.modelName, fields: config.fields });
};

export const genericModelController = async (req, res) => {
  const { model, id } = req.params;
  const resolved = resolveModelConfig(model);
  if (!resolved) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const { Model } = resolved;

  try {
    if (req.method === 'GET') {
      if (id) {
        const item = await Model.findOne({ _id: id, deleted: { $ne: true } })
          .populate('deletedBy', 'email');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        console.log('Single item:', JSON.stringify(item, null, 2));
        return res.json(item);
      }

      // Check if requesting deleted items
      const showDeleted = req.query.deleted === 'true';
      if (showDeleted && req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can view deleted items' });
      }

      const query = showDeleted ? { deleted: true } : { deleted: { $ne: true } };
      const items = await Model.find(query)
        .populate('deletedBy', 'email');
      
      // Debug logging
      if (showDeleted) {
        console.log('Deleted employees:', JSON.stringify(items, null, 2));
      }
      
      return res.json(items);
    }

    if (req.method === 'POST') {
      const payload = { ...req.body };
      if (Model.schema.path('createdBy') && req.user?.id) {
        payload.createdBy = req.user.id;
      }

      const item = new Model(payload);
      await item.save();
      return res.status(201).json(item);
    }

    if (req.method === 'PUT') {
      const updateData = { ...req.body };

      // Add audit trail
      if (req.user?.id) {
        updateData.updatedBy = req.user.id;
        updateData.updatedAt = new Date();
      }

      const item = await Model.findOneAndUpdate(
        { _id: id, deleted: { $ne: true } },
        updateData,
        { new: true }
      );
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.json(item);
    }

    if (req.method === 'DELETE') {
      // Soft delete instead of hard delete
      const updateData = { deleted: true };
      if (req.user?.id) {
        updateData.deletedBy = req.user.id;
        updateData.deletedAt = new Date();
      }

      const item = await Model.findOneAndUpdate(
        { _id: id, deleted: { $ne: true } },
        updateData,
        { new: true }
      ).populate('deletedBy', 'email');
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.json({ message: 'Item soft deleted' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Model controller error:', err.message, err);
    // Provide more detailed error messages for debugging
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate entry - this record already exists' });
    }
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const softDeleteModelItem = async (req, res) => {
  const { model, id } = req.params;
  const resolved = resolveModelConfig(model);
  if (!resolved) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const { Model } = resolved;

  try {
    const updateData = { deleted: true };
    if (req.user?.id) {
      updateData.deletedBy = req.user.id;
      updateData.deletedAt = new Date();
    }

    const item = await Model.findOneAndUpdate(
      { _id: id, deleted: { $ne: true } },
      updateData,
      { new: true }
    ).populate('deletedBy', 'email');

    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json({ message: 'Item soft deleted' });
  } catch (err) {
    console.error('Soft delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// New endpoint for undeleting items
export const undeleteModelItem = async (req, res) => {
  const { model, id } = req.params;
  const resolved = resolveModelConfig(model);
  if (!resolved) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const { Model } = resolved;

  try {
    const updateData = {
      deleted: false,
      deletedBy: null,
      deletedAt: null
    };

    // Add audit trail for undelete
    if (req.user?.id) {
      updateData.updatedBy = req.user.id;
      updateData.updatedAt = new Date();
    }

    const item = await Model.findOneAndUpdate(
      { _id: id, deleted: true },
      updateData,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Deleted item not found' });
    return res.json({ message: 'Item restored', item });
  } catch (err) {
    console.error('Undelete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// New endpoint for permanent deletion of items
export const permanentDeleteModelItem = async (req, res) => {
  const { model, id } = req.params;
  const resolved = resolveModelConfig(model);
  if (!resolved) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const { Model } = resolved;

  try {
    const item = await Model.findOneAndDelete({ _id: id, deleted: true });
    if (!item) return res.status(404).json({ message: 'Deleted item not found' });
    return res.json({ message: 'Item permanently deleted' });
  } catch (err) {
    console.error('Permanent delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
