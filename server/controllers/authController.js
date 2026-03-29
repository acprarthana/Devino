const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          return res.status(400).json({ message: 'username, email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
          return res.status(409).json({ message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        user.lastLoginAt = new Date();
        await user.save();

        res.json({
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing' });

    const user = await User.findOne({});
    // find user by refresh token hash using bcrypt compare on all users is not efficient; use explicit token store in DB in production.
    const users = await User.find({ refreshTokenHash: { $exists: true, $ne: null } });
    let matchedUser = null;
    for (const u of users) {
      const match = await bcrypt.compare(refreshToken, u.refreshTokenHash);
      if (match) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(matchedUser);
    const newRefreshToken = generateRefreshToken();
    matchedUser.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await matchedUser.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing' });

    const users = await User.find({ refreshTokenHash: { $exists: true, $ne: null } });
    let matchedUser = null;

    for (const u of users) {
      const match = await bcrypt.compare(refreshToken, u.refreshTokenHash);
      if (match) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(200).json({ message: 'Logged out' });
    }

    matchedUser.refreshTokenHash = null;
    await matchedUser.save();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}; 