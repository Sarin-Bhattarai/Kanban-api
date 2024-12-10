const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { registerUser, loginUser, getUser } = require("../controllers/user");

const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to log in a user
router.post("/login", loginUser);

//Route to get a user
router.get("/user", authMiddleware, getUser);

module.exports = router;
