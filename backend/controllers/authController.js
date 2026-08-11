const User = require('../models/User');

// @desc    Verify admin credentials (for frontend check/login)
// @route   POST /api/admin/login
// @access  Public
const verifyAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username.toLowerCase() !== 'mshahzaib') {
      return res.status(401).json({ success: false, message: 'Invalid admin username' });
    }

    const admin = await User.findOne({ username: 'mshahzaib' });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin user not initialized' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    res.json({
      success: true,
      message: 'Authentication successful',
      admin: {
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

// @desc    Change admin password (owner only)
// @route   PUT /api/admin/change-password
// @access  Private (Admin Protected)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const admin = req.admin; // populated by protectAdmin middleware

    // Strict safety check: double-check username lock
    if (admin.username !== 'mshahzaib') {
      return res.status(403).json({ success: false, message: 'Access denied: Only owner is authorized' });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid current password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

module.exports = {
  verifyAdmin,
  changePassword
};
