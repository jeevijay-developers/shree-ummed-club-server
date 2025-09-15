import { Router } from 'express';
import { createEventGallery, getAllEventGalleries, getEventGalleryBySlug, deleteEventGallery } from '../controllers/eventGallery.controller.js';
import { upload } from '../util/cloudinary.js';

const router = Router();

// Create a new event gallery (with banner and multiple gallery images)
router.post('/', upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), createEventGallery);

// Get all event galleries (paginated)
router.get('/', getAllEventGalleries);

// Get event gallery by slug
router.get('/:slug', getEventGalleryBySlug);

// Delete event gallery by ID
router.delete('/delete/:id', deleteEventGallery);

export default router;