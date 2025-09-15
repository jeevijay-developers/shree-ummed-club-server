import { Router } from 'express';
import { createFacility, deleteFacility, getFacilities, getFacilityBySlug } from '../controllers/facility.controller.js';
import { upload } from '../util/cloudinary.js';

const router = Router();

// Get all facilities (paginated)
router.get('/get-all', getFacilities);

// Get facility by slug
router.get('/slug/:slug', getFacilityBySlug);

// Create a new facility (with image upload)
router.post('/', upload.array('images', 5), createFacility);

router.delete('/delete/:id', deleteFacility);

export default router;
