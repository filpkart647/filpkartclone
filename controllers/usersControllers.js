const User = require("../models/User");

// Add User
exports.addUser = async (req, res) => {
  try {
    const { username,email, password } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      username,  
      email,
      password,
      accountType: 'User'
    });

    // Save user to database
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    // Get page and limit from query, or set defaults
    const skip = parseInt(req.query.skip) || 1;
    const take = parseInt(req.query.take) || 10;


    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Get users for the current page
    const users = await User.find()
      .skip(skip) // Skip the previous pages
      .limit(take);    // Limit to the number of users per page


    // Meta information about pagination
    res.status(200).json({count: totalUsers, skip, take, users});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


