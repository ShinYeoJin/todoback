const prisma = require("../config/prisma");
const { validationResult } = require("express-validator");

const isValidDate = (date) => !isNaN(Date.parse(date));

class TodoController {
  // Get all todos with subtasks
  static async getAllTodos(req, res, next) {
    try {
      const todos = await prisma.todos.findMany({
        include: {
          subtasks: {
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: [{ position: "asc" }, { created_at: "desc" }],
      });

      res.json({
        success: true,
        data: todos,
        count: todos.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get todos by date
  static async getTodosByDate(req, res, next) {
    try {
      const { date } = req.params;

      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      const todos = await prisma.todos.findMany({
        where: {
          date: new Date(date),
        },
        include: {
          subtasks: {
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: [{ position: "asc" }, { created_at: "desc" }],
      });

      res.json({
        success: true,
        data: todos,
        count: todos.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single todo by ID
  static async getTodoById(req, res, next) {
    try {
      const { id } = req.params;

      const todo = await prisma.todos.findUnique({
        where: { id: parseInt(id) },
        include: {
          subtasks: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      res.json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new todo
  static async createTodo(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { title, date, position = 0 } = req.body;

      const todo = await prisma.todos.create({
        data: {
          title,
          date: new Date(date),
          position,
        },
        include: {
          subtasks: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: todo,
      });
    } catch (error) {
      next(error);
    }
    console.log("Prisma Client:", prisma);
  }

  // Update todo
  static async updateTodo(req, res, next) {
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
      if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
      if (req.body.completed !== undefined) updateData.completed = req.body.completed;
      if (req.body.position !== undefined) updateData.position = req.body.position;

      const todo = await prisma.todos.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          subtasks: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      res.json({
        success: true,
        message: "Todo updated successfully",
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle todo completion
  static async toggleTodo(req, res, next) {
    try {
      const { id } = req.params;

      const currentTodo = await prisma.todos.findUnique({
        where: { id: parseInt(id) },
      });

      if (!currentTodo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      const todo = await prisma.todos.update({
        where: { id: parseInt(id) },
        data: {
          completed: !currentTodo.completed,
        },
        include: {
          subtasks: true,
        },
      });

      res.json({
        success: true,
        message: "Todo toggled successfully",
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete todo
  static async deleteTodo(req, res, next) {
    try {
      const { id } = req.params;

      const todo = await prisma.todos.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        success: true,
        message: "Todo deleted successfully",
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update positions (for drag & drop)
  static async updatePositions(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      // 프론트에서 넘어오는 형식: { positions: [{ id, position }, ...] }
      const { positions } = req.body;

      // Use transaction to update all positions based on provided (id, position) pairs
      await prisma.$transaction(
        positions.map((item) =>
          prisma.todos.update({
            where: { id: parseInt(item.id) },
            data: { position: item.position },
          })
        )
      );

      console.log(prisma);

      res.json({
        success: true,
        message: "Positions updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
