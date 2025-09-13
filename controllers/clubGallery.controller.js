import ClubGallery from '../models/clubGallery.model.js';

// Create a new club gallery entry
export const addClubGallery = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Handle multiple image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // Cloudinary URLs
    } else {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // Create the club gallery entry
    const clubGallery = new ClubGallery({ 
      title, 
      images 
    });
    
    await clubGallery.save();
    
    res.status(201).json(clubGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all club gallery entries (paginated)
export const getAllClubGallery = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    const clubGalleries = await ClubGallery.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip(skip)
      .limit(limit);
      
    const total = await ClubGallery.countDocuments();
    
    res.json({ 
      clubGalleries, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get club gallery by ID
export const getClubGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const clubGallery = await ClubGallery.findById(id);
    
    if (!clubGallery) {
      return res.status(404).json({ error: 'Club gallery not found' });
    }
    
    res.json(clubGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};