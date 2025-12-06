const express = require("express");
const router = express.Router();
const TodoController = require("../controllers/todoController");
const { todoValidation } = require("../middleware/validator");

// Get all todos
router.get("/", TodoController.getAllTodos);

// Get todos by date
router.get("/date/:date", TodoController.getTodosByDate);

// Get single todo by ID
router.get("/:id", todoValidation.id, TodoController.getTodoById);

// Create new todo
router.post("/", todoValidation.create, TodoController.createTodo);

// Update todo
router.put("/:id", todoValidation.update, TodoController.updateTodo);

// Toggle todo completion
router.patch("/:id/toggle", todoValidation.id, TodoController.toggleTodo);

// Delete todo
router.delete("/:id", todoValidation.id, TodoController.deleteTodo);

// Update positions (drag & drop)
router.patch("/reorder/positions", todoValidation.positions, TodoController.updatePositions);

module.exports = router;
