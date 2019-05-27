import express from 'express';
import todoController from '../controllers/TodoController.js';
import authController from "../controllers/AuthController.js"
import userController from "../controllers/UserController.js"

const router = express.Router();

// get all todos
router.get('/api/v1/todos', todoController.getAllTodos);
router.post('/api/v1/todos', todoController.createTodo);

router.post('/api/v1/auth/token', authController.handleGoogleAuthCode);
router.get('/api/v1/auth/callback', authController.handleGoogleOauthCallback);

router.post('/api/v1/user',
    userController.validate('createUser'),
    userController.createUser);
router.put('/api/v1/user/:id',
    userController.validate('updateUser'),
    userController.updateUser);

export default router;