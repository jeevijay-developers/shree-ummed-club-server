import Event from '../models/event.model.js';
import { deleteImageFromCloudinary } from '../util/imageUtils.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { eventDate, shortDescription, name } = req.body;
    
    // Handle image upload
    let image = '';
    if (req.file) {
      image = req.file.path; // Cloudinary URL
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    const event = new Event({ image, eventDate, shortDescription, name });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all events (paginated)
export const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const events = await Event.find()
      .sort({ eventDate: -1 }) // Sort by most recent event date
      .skip(skip)
      .limit(limit);
      
    const total = await Event.countDocuments();
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get events by date
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params; // Expected format: YYYY-MM-DD
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Next day to include the full day
    
    const events = await Event.find({
      eventDate: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ eventDate: 1 });
    
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First find the event to get its image
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Delete image from Cloudinary
    let deletedImage = false;
    if (event.image) {
      try {
        await deleteImageFromCloudinary(event.image, 'facilities');
        deletedImage = true;
        console.log(`Deleted event image from Cloudinary: ${event.image}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with deletion even if image deletion fails
      }
    }
    
    // Delete the event
    await Event.findByIdAndDelete(id);
    
    res.json({ 
      message: 'Event deleted successfully',
      deletedImage: deletedImage
    });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: err.message });
  }
};