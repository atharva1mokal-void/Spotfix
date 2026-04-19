const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, mobile, password, userType, department } = req.body;

  try {
    // Only citizens can self-register
    if (userType === 'admin' || userType === 'authority') {
      return res.status(403).json({ message: 'Admin and Authority accounts must be provisioned by an admin.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      userType: userType || 'citizen',
      department,
    });

    const savedUser = await newUser.save();
    
    // Create JWT
    const token = jwt.sign(
      { id: savedUser._id, userType: savedUser.userType, department: savedUser.department },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType,
        department: savedUser.department,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Admin provisions Authority or Admin accounts
exports.provisionUser = async (req, res) => {
  const { name, email, mobile, password, userType, department } = req.body;

  try {
    // Only admins can provision
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Only admins can provision accounts.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      userType,
      department,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType,
        department: savedUser.department,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error provisioning user', error: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, mobile, identifier, password, userType } = req.body;
  const loginIdentifier = identifier || email || mobile;

  try {
    // Find user by either email or mobile
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { mobile: loginIdentifier }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    // Role check
    if (userType && user.userType !== userType) {
      return res.status(403).json({ message: `Access denied. Not registered as ${userType}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType, department: user.department },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        department: user.department,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// GET /api/auth/me — get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// GET /api/auth/users — Admin gets all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// PATCH /api/auth/users/:id/ban — Admin bans/unbans a user
exports.toggleBanUser = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      user: { _id: user._id, name: user.name, isBanned: user.isBanned }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status', error: err.message });
  }
};
