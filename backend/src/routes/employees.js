import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { genericModelController, getModelDefinition, validateModel, softDeleteModelItem, undeleteModelItem, permanentDeleteModelItem } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/definitions/:model', authMiddleware, getModelDefinition);
router.get('/:model', authMiddleware, genericModelController);
router.get('/:model/:id', authMiddleware, genericModelController);
router.post('/:model', authMiddleware, validateModel('employees'), genericModelController);
router.put('/:model/:id', authMiddleware, validateModel('employees', true), genericModelController);
router.patch('/:model/:id/soft-delete', authMiddleware, softDeleteModelItem);
router.delete('/:model/:id', authMiddleware, genericModelController);
router.patch('/:model/:id/undelete', authMiddleware, undeleteModelItem);
router.delete('/:model/:id/permanent', authMiddleware, permanentDeleteModelItem);

export default router;
