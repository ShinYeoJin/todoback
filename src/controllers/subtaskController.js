const prisma = require("../config/prisma");
const { validationResult } = require("express-validator");

class SubtaskController {
  // Get all subtasks for a todo
  static async getSubtasksByTodoId(req, res, next) {
    try {
      const { todoId } = req.params;

      const subtasks = await prisma.subtasks.findMany({
        where: {
          todo_id: parseInt(todoId),
        },
        orderBy: [{ position: "asc" }, { created_at: "asc" }],
      });

      res.json({
        success: true,
        data: subtasks,
        count: subtasks.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new subtask
  static async createSubtask(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { todoId, title, position = 0 } = req.body;

      // Check if todo exists
      const todoExists = await prisma.todos.findUnique({
        where: { id: parseInt(todoId) },
      });

      if (!todoExists) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      const subtask = await prisma.subtasks.create({
        data: {
          todo_id: parseInt(todoId),
          title,
          position,
        },
      });

      res.status(201).json({
        success: true,
        message: "Subtask created successfully",
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update subtask
  static async updateSubtask(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const updateData = {};

      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.completed !== undefined) updateData.completed = req.body.completed;
      if (req.body.position !== undefined) updateData.position = req.body.position;

      const subtask = await prisma.subtasks.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      res.json({
        success: true,
        message: "Subtask updated successfully",
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle subtask completion
  static async toggleSubtask(req, res, next) {
    try {
      const { id } = req.params;

      const currentSubtask = await prisma.subtasks.findUnique({
        where: { id: parseInt(id) },
      });

      if (!currentSubtask) {
        return res.status(404).json({
          success: false,
          message: "Subtask not found",
        });
      }

      const subtask = await prisma.subtasks.update({
        where: { id: parseInt(id) },
        data: {
          completed: !currentSubtask.completed,
        },
      });

      res.json({
        success: true,
        message: "Subtask toggled successfully",
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete subtask
  static async deleteSubtask(req, res, next) {
    try {
      const { id } = req.params;

      const subtask = await prisma.subtasks.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Subtask deleted successfully",
        data: subtask,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubtaskController;
