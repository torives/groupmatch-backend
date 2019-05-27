import express from 'express';
const { check } = require('express-validator/check');
import todoController from '../controllers/TodoController.js';
import authController from "../controllers/AuthController.js"
import userController from "../controllers/UserController.js"

const router = express.Router();

// get all todos
router.get('/api/v1/todos', todoController.getAllTodos);
router.post('/api/v1/todos', todoController.createTodo);

router.post('/api/v1/auth/token', authController.handleGoogleAuthCode)
router.get('/api/v1/auth/callback', authController.handleGoogleOauthCallback)

router.post('/api/v1/user', [
    check("email")
        .exists()
        .isEmail()
], userController.createUser)
router.put('/api/v1/user/:id', userController.updateUser)

export default router;