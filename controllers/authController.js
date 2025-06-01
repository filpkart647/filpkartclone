const bcrypt = require('bcryptjs');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, type } = req.body;

      // Check if the user exists
      let user = await User.findOne({ username, accountType: type });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if the password matches
      let isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      let token = jwt.sign(
        { userId: user._id, accountType: user.accountType },
        JWT_SECRET
      );

      // Respond with token and user account type
      return res.status(200).json({ type: user.accountType, token });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



