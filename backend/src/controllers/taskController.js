const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort('-createdAt');
    sendSuccess(res, 'Tasks retrieved', { tasks });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return sendError(res, 'Title is required', 400);

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      priority: priority || 'medium',
      user: req.user._id,
    });

    sendSuccess(res, 'Task created', { task }, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);

    if (task.user.toString() !== req.user.id) {
      return sendError(res, 'Not authorized', 403);
    }

    const { title, description, status, priority } = req.body;
    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;

    await task.save();

    sendSuccess(res, 'Task updated', { task });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);

    if (task.user.toString() !== req.user.id) {
      return sendError(res, 'Not authorized', 403);
    }

    await task.deleteOne();

    sendSuccess(res, 'Task deleted');
  } catch (err) {
    next(err);
  }
};
