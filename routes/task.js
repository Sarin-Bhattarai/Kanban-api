const express = require("express");
const { verifyLogin } = require("../middlewares/verifyLogin");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task");

const router = express.Router();

// Route: Create a task
router.post("/", verifyLogin, createTask);

// Route: Get all tasks
router.get("/", verifyLogin, getTasks);

// Route: Get a specific task by ID
router.get("/:id", verifyLogin, getTaskById);

// Route: Update a task
router.put("/:id", verifyLogin, updateTask);

// Route: Delete a task
router.delete("/:id", verifyLogin, deleteTask);

module.exports = router;
