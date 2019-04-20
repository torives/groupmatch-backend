/* eslint-disable class-methods-use-this */
import db from '../db/db';

class TodoController {
    getAllTodos(req, res) {
        return res.status(200).send({
            success: 'true',
            message: 'todos retrieved successfully',
            todos: db,
        });
    }

    createTodo(req, res) {
        if (!req.body.title) {
            return res.status(400).send({
                success: 'false',
                message: 'title is required',
            });
        } else if (!req.body.description) {
            return res.status(400).send({
                success: 'false',
                message: 'description is required',
            });
        }
        const todo = {
            id: db.length + 1,
            title: req.body.title,
            description: req.body.description,
        };
        db.push(todo);
        return res.status(201).send({
            success: 'true',
            message: 'todo added successfully',
            todo,
        });
    }
}

const todoController = new TodoController();
export default todoController;