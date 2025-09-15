import { Router } from 'express';
import { createEvent, getEvents, getEventsByDate, deleteEvent } from '../controllers/event.controller.js';
import { upload } from '../util/cloudinary.js';

const router = Router();

// Create a new event (with image upload)
router.post('/', upload.single('image'), createEvent);

// Get all events (paginated)
router.get('/', getEvents);

// Get events by date (YYYY-MM-DD format)
router.get('/date/:date', getEventsByDate);

// Delete event by ID
router.delete('/delete/:id', deleteEvent);

export default router;