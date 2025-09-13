import Facility from '../models/facility.model.js';
import Blog from '../models/blog.model.js';

// Create a new facility
export const createFacility = async (req, res) => {
  try {
    const { name, data } = req.body;
    
    // Parse blog data if it's a string
    let blogData;
    try {
      blogData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid blog data format' });
    }

    // Create the blog first
    const blog = new Blog({
      title: blogData.title,
      description: blogData.description,
      features: blogData.features || []
    });
    await blog.save();

    // Handle image upload
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }

    // Create the facility with the blog reference
    const facility = new Facility({ name, images, data: blog._id });
    await facility.save();
    
    // Populate the blog data in the response
    await facility.populate('data');
    
    res.status(201).json(facility);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all facilities (paginated)
export const getFacilities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const facilities = await Facility.find()
      .populate('data')
      .skip(skip)
      .limit(limit);
    const total = await Facility.countDocuments();
    res.json({ facilities, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get facility by slug
export const getFacilityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const facility = await Facility.findOne({ slug }).populate('data');
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
