import Event from '../models/event.model.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { eventDate, shortDescription } = req.body;
    
    // Handle image upload
    let image = '';
    if (req.file) {
      image = req.file.path; // Cloudinary URL
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    const event = new Event({ image, eventDate, shortDescription });
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