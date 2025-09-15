import { Router } from 'express';
import { addClubGallery, getAllClubGallery, getClubGalleryById, deleteClubGallery } from '../controllers/clubGallery.controller.js';
import { upload } from '../util/cloudinary.js';

const router = Router();

// Create a new club gallery entry (with multiple image uploads)
router.post('/', upload.array('images', 10), addClubGallery);

// Get all club gallery entries (paginated)
router.get('/', getAllClubGallery);

// Get club gallery by ID
router.get('/:id', getClubGalleryById);

// Delete club gallery by ID
router.delete('/delete/:id', deleteClubGallery);

export default router;