import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Database health check
router.get('/db', (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    
    // readyState values: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      res.status(200).json({
        status: 'success',
        message: 'Database connected',
        connection: 'healthy'
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: 'Database not connected',
        connection: 'unhealthy',
        state
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// General health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;