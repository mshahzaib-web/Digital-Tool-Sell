const express = require('express');
const router = express.Router();
const {
  getTools,
  getLatestTools,
  searchTools,
  getCategories,
  getToolById,
  createTool,
  updateTool,
  deleteTool
} = require('../controllers/toolController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/latest-tools', getLatestTools);
router.get('/search', searchTools);
router.get('/categories', getCategories);
router.get('/tools', getTools);
router.get('/tools/:id', getToolById);

// Protected routes
router.post('/tools', protectAdmin, createTool);
router.put('/tools/:id', protectAdmin, updateTool);
router.delete('/tools/:id', protectAdmin, deleteTool);

module.exports = router;
