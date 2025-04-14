const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const User = require('../Models/User');


const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists, you can login', success: false });
        }

        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10); // Hash the password
        await userModel.save();

        res.status(201).json({ message: "Signup successfully", success: true });
    } catch (err) {
        console.error("Error during login:", err); 
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
// Login controller

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(403).json({ message: 'Invalid credentials', success: false });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(403).json({ message: 'Invalid credentials', success: false });
      }
  
      // Generate JWT tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Save refresh token to the user document (if necessary)
      user.refreshToken = refreshToken;
      await user.save();
  
      // Send response with tokens
      res.status(200).json({ success: true, accessToken, refreshToken , user: {
        id: user._id,
        email: user.email,
        name: user.name // if needed
    }});
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  };
  
  const generateAccessToken = (user) => {
    return jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET, // Ensure the key exists in your .env
      { expiresIn: process.env.JWT_ACCESS_EXPIRY } // Ensure the expiry exists in your .env
    );
  };
  
  const generateRefreshToken = (user) => {
    return jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_REFRESH_SECRET, // Ensure the key exists in your .env
      { expiresIn: process.env.JWT_REFRESH_EXPIRY } // Ensure the expiry exists in your .env
    );
  };
  
  
  // Refresh token controller
  const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required', success: false });
    }
  
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token', success: false });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = generateAccessToken(user);
      res.status(200).json({ success: true, accessToken });
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired refresh token', success: false });
    }
  };

module.exports = {
    signup,
    login,
    refreshToken 
}