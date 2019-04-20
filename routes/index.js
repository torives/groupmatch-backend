import express from 'express';
import db from '../db/db';
import todoController from '../controllers/todoController.js';

const router = express.Router();

// get all todos
router.get('/api/v1/todos', todoController.getAllTodos);
router.post('/api/v1/todos', todoController.createTodo);

export default router;