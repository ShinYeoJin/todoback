const express = require("express");
const router = express.Router();
const SubtaskController = require("../controllers/subtaskController");
const { subtaskValidation } = require("../middleware/validator");

// Get all subtasks for a todo
router.get("/todo/:todoId", SubtaskController.getSubtasksByTodoId);

// Create new subtask
router.post("/", subtaskValidation.create, SubtaskController.createSubtask);

// Update subtask
router.put("/:id", subtaskValidation.update, SubtaskController.updateSubtask);

// Toggle subtask completion
router.patch("/:id/toggle", subtaskValidation.id, SubtaskController.toggleSubtask);

// Delete subtask
router.delete("/:id", subtaskValidation.id, SubtaskController.deleteSubtask);

module.exports = router;
