import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { AddRepeatable, ArchiveRepeatable, DeleteRepeatable, GetRepeatables, GetRepeatableById, UpdateRepeatable } from "../helpers/repeatables.js";
import { GetTodoByRepeatId } from "../helpers/todos.js";

const repeatables = new Hono(); 

/**
 * Returns open todos by default. Will return others on query parameter 'type':
 * ex: ?type=all or type=completed
 */
repeatables.get('/', async (c) => {
    try {
        const type = c.req.query('type') ?? 'open';
        let repeatbles = await GetRepeatables(type);        

        return c.json({
            repeatables: repeatbles
        })
    } catch (e) {
        throw new HTTPException(500, { message: 'Error getting repeatables', cause: e});
    }
}).post(async (c) => {
    try {
        const data = c.req.json();
        const success = await AddRepeatable(data);
        return c.json({ success });
    } catch (e) {
        throw new HTTPException(500, { message: 'Error inserting repeatable(s)', cause: e})
    }
})

repeatables.get('/:id', async (c) => {
    const id = c.req.param('id')
    try {
        const repeatable = await GetRepeatableById(Number.parseInt(id));
        return c.json({ repeatable });
    } catch (e) {
        throw new HTTPException(500, { message: `Error getting repeatable ID: ${id}`, cause: e})
    }
}).put(async (c) => {
    const id = c.req.param('id');
    try {
        const params = await c.req.json();
        const repeatable = UpdateRepeatable(Number.parseInt(id), params);
        return c.json({ repeatable });
    } catch (e) {
        throw new HTTPException(500, { message: `Error getting repeatable ID: ${id}`, cause: e})
    }
}).delete(async (c) => {
    const id = c.req.param('id');
    try {
        const repeatable = DeleteRepeatable(Number.parseInt(id));
        return c.json({ todo: repeatable });
    } catch (e) {
        throw new HTTPException(500, { message: `Error deleting repeatable ID: ${id}`, cause: e})
    }
})

repeatables.get('/:id/todos', async (c) => {
    const id = c.req.param('id');
    try {
        const repeatableId = Number.parseInt(id);
        const todos = GetTodoByRepeatId(repeatableId);

        return c.json({ todos });
    } catch (e) {
        throw new HTTPException(500, { message: `Error get to-dos associated with repeatable ID: ${id}`, cause: e})
    }
})

repeatables.put('/archive/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const todo = ArchiveRepeatable(Number.parseInt(id));
        return c.json({ todo });
    } catch (e) {
        throw new HTTPException(500, { message: `Error archiving repeatable ID: ${id}`, cause: e})
    }
})

export { repeatables };