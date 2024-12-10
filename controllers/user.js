const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const checkUser = await User.findOne({ email: req.body.email });
      if (checkUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already in use",
        });
      }

      const newUser = new User(req.body);
      const result = await newUser.save();
      const { password, ...user } = result.toObject(); // De-structuring to avoid sending hashed password

      return res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User doesn't exist",
        });
      }

      const passwordMatch = await user.matchPassword(req.body.password); // Use matchPassword from the model
      if (!passwordMatch) {
        return res.status(400).json({
          status: "error",
          message: "Invalid password",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);
      return res.header("x-auth-token", token).json({ token });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
};
