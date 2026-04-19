const User = require('../models/User');

// GET /api/users/leaderboard — Top citizens by karma
exports.getLeaderboard = async (req, res) => {
  try {
    const topCitizens = await User.find({ userType: 'citizen' })
      .sort({ karma: -1 })
      .limit(10)
      .select('name karma');
    res.json(topCitizens);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
};

// GET /api/users/profile — Current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};
