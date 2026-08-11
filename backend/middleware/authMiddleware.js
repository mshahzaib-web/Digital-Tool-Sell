const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  const username = req.headers['x-admin-username'] || req.body.adminUsername;
  const password = req.headers['x-admin-password'] || req.body.adminPassword;

  if (!username || !password) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Credentials are required' });
  }

  try {
    // Exact username check, locked to 'mshahzaib'
    if (username.toLowerCase() !== 'mshahzaib') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Username is invalid or not allowed' });
    }

    const admin = await User.findOne({ username: 'mshahzaib' });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Admin user not initialized' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid credentials' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authorization' });
  }
};

module.exports = { protectAdmin };
