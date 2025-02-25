import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { AddTodos, GetTodos, GetTodoById, UpdateTodo, DeleteTodo, AddTodo } from "../helpers/todos.js";

const todos = new Hono(); 

/**
 * Returns open todos by default. Will return others on query parameter 'type':
 * ex: ?type=all or type=completed or type=open
 */
todos.get('/', async (c) => {
    try {
        const type = c.req.query('type') ?? 'open';
        let todos = await GetTodos(type);        

        return c.json({
            todos
        })
    } catch (e) {
        throw new HTTPException(500, { message: 'Error getting to-dos', cause: e});
    }
}).post(async (c) => {
    try {
        const data = await c.req.json();
        const id = await AddTodo(data);
        return c.json({ id });
    } catch (e) {
        throw new HTTPException(500, { message: 'Error inserting to-do', cause: e})
    }
})

todos.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const todo = await GetTodoById(Number.parseInt(id));
        return c.json({ todo });
    } catch (e) {
        throw new HTTPException(500, { message: `Error getting to-do ID: ${id}`, cause: e})
    }
}).put(async (c) => {
    const id = c.req.param('id');
    try {
        const params = await c.req.json();
        const updatedId = UpdateTodo(Number.parseInt(id), params);
        return c.json({ updatedId });
    } catch (e) {
        throw new HTTPException(500, { message: `Error updating to-do ID: ${id}`, cause: e})
    }
}).delete(async (c) => {
    const id = c.req.param('id');
    try {
        const todo = DeleteTodo(Number.parseInt(id));
        return c.json({ todo });
    } catch (e) {
        throw new HTTPException(500, { message: `Error deleting to-do ID: ${id}`, cause: e})
    }
})

export { todos };