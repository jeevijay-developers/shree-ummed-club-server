import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import facilityRoutes from './routes/facility.route.js';
import eventRoutes from './routes/event.route.js';
import clubGalleryRoutes from './routes/clubGallery.route.js';
import eventGalleryRoutes from './routes/eventGallery.route.js';
import healthRoutes from './routes/health.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/facilities', facilityRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/club-gallery', clubGalleryRoutes);
app.use('/api/event-gallery', eventGalleryRoutes);
app.use('/api/health', healthRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Ummed Bhavan Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
