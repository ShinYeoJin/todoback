const { body, param } = require("express-validator");

// Todo validation rules
const todoValidation = {
  create: [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
    body("position").optional().isInt({ min: 0 }).withMessage("Position must be a positive integer"),
  ],

  update: [
    param("id").isInt({ min: 1 }).withMessage("Invalid todo ID"),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
    body("position").optional().isInt({ min: 0 }).withMessage("Position must be a positive integer"),
  ],

  id: [param("id").isInt({ min: 1 }).withMessage("Invalid todo ID")],

  // 프론트에서 보내는 형식: { positions: [{ id, position }, ...] }
  positions: [
    body("positions").isArray({ min: 1 }).withMessage("positions must be a non-empty array"),
    body("positions.*.id").isInt({ min: 1 }).withMessage("Each position item must have a valid id"),
    body("positions.*.position").isInt({ min: 0 }).withMessage("Each position value must be a positive integer"),
  ],
};

// Subtask validation rules
const subtaskValidation = {
  create: [
    body("todoId").isInt({ min: 1 }).withMessage("Valid todoId is required"),
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("position").optional().isInt({ min: 0 }).withMessage("Position must be a positive integer"),
  ],

  update: [
    param("id").isInt({ min: 1 }).withMessage("Invalid subtask ID"),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 255 }).withMessage("Title must be less than 255 characters"),
    body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
    body("position").optional().isInt({ min: 0 }).withMessage("Position must be a positive integer"),
  ],

  id: [param("id").isInt({ min: 1 }).withMessage("Invalid subtask ID")],
};

module.exports = {
  todoValidation,
  subtaskValidation,
};
