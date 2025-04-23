// AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Ensure passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match", success: false });
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists, please login', success: false });
    }

    // Get the latest userId value (for example, increment the latest one)
    const lastUser = await UserModel.findOne().sort({ userId: -1 }).limit(1);

    // Ensure the lastUser.userId is a valid number
    const newUserId = (lastUser && !isNaN(lastUser.userId)) ? lastUser.userId + 1 : 1; // Default to 1 if invalid

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user model
    const userModel = new UserModel({
      name,
      email,
      password: hashedPassword,  // Save the hashed password
      userId: newUserId,
    });

    // Save the user to the database
    await userModel.save();

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        userId: userModel.userId,
        email: userModel.email,
        name: userModel.name,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send tokens to the client
    res.status(200).json({
      accessToken, refreshToken, userId: user.userId,
      name: user.name, 
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // Ensure the refresh token exists
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token using the data from the decoded refresh token
    const accessToken = generateAccessToken(decoded);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,  
      email: user.email,
      name: user.name,     
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};


const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,  
      email: user.email,
      name: user.name,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};


module.exports = { signup, login, refreshToken };
