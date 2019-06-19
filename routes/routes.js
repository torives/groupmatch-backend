import express from "express";
import todoController from "../controllers/TodoController";
import { authController } from "../controllers/AuthController"
import { userController } from "../controllers/UserController"
import { matchController } from "../controllers/MatchController"

export const router = express.Router();


// Todos (test)
router.get("/api/v1/todos", todoController.getAllTodos);
router.post("/api/v1/todos", todoController.createTodo);

// Authentication
router.post("/api/v1/auth/token",
    authController.validate("exchangeAuthCode"),
    authController.exchangeAuthCode
);
router.get("/api/v1/auth/callback", authController.handleGoogleOauthCallback);

// User
router.post("/api/v1/users",
    userController.validate("createUser"),
    userController.createUser);
router.put("/api/v1/users/:id",
    userController.validate("updateUser"),
    userController.updateUser);

// Match
router.post("/api/v1/match",
    matchController.validate("createMatch"),
    matchController.createMatch);
router.put("/api/v1/match/:id",
    matchController.validate("addAnswer"),
    matchController.addAnswer);
