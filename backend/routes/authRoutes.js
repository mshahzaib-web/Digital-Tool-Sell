const express = require('express');
const router = express.Router();
const { verifyAdmin, changePassword } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/admin/login', verifyAdmin);
router.put('/admin/change-password', protectAdmin, changePassword);

module.exports = router;
