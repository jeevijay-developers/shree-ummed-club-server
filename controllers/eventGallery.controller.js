import EventGallery from '../models/eventGallery.model.js';

// Create a new event gallery
export const createEventGallery = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Handle banner upload (single image)
    let banner = '';
    if (req.files && req.files.banner && req.files.banner[0]) {
      banner = req.files.banner[0].path; // Cloudinary URL
    } else {
      return res.status(400).json({ error: 'Banner image is required' });
    }

    // Handle multiple gallery images upload
    let images = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      images = req.files.images.map(file => file.path); // Cloudinary URLs
    } else {
      return res.status(400).json({ error: 'At least one gallery image is required' });
    }

    // Create the event gallery
    const eventGallery = new EventGallery({ 
      banner,
      title, 
      images,
      content
    });
    
    await eventGallery.save();
    
    res.status(201).json(eventGallery);
  } catch (err) {
    console.error('Event gallery creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all event galleries (paginated)
export const getAllEventGalleries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const eventGalleries = await EventGallery.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip(skip)
      .limit(limit);
      
    const total = await EventGallery.countDocuments();
    
    res.json({ 
      eventGalleries, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get event gallery by slug
export const getEventGalleryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const eventGallery = await EventGallery.findOne({ slug });
    
    if (!eventGallery) {
      return res.status(404).json({ error: 'Event gallery not found' });
    }
    
    res.json(eventGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};