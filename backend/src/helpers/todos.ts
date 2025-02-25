import { db } from "../../database/db.js";

interface todo {
    id: number;
    content: string;
    category: string;
    created: Date;
    completed: Date | null;
    repeatable: number | null;
}

//#region GET
/**
 * @param type expects 'open' | 'completed' | 'all'; defaults to 'open
 * @returns 
 */
export async function GetTodos(type: string = 'open') {
    try {
        switch (type) {
            case 'all':
                return await db.todo.many();
            case 'completed':
                return await db.completed_todos.many();
            case 'open':
            default:
                return await db.open_todos.many();

        }
    } catch (e) {
        throw new Error(`Error getting${type} to-dos`, { cause: e });
    }
}

export async function GetTodoById(id: number) {
    try {
        return await db.todo.get({ id });
    } catch (e) {
        throw new Error(`Error getting to-do with ID: ${id}`, { cause: e });
    }
}

export async function GetTodoByRepeatId(id: number) {
    try {
        return await db.todo.many({ repeat_Id: id });
    } catch (e) {
        throw new Error(`Error getting to-do with Repeat ID: ${id}`, { cause: e });
    }
}
//#endregion GET

//#region INSERT
export async function AddTodo(todo: any) {
    try {
        console.log('inserting...', todo)
        const id = await db.todos.insert(todo);
        return id;
    } catch (e) {
        throw new Error('Error inserting to-do(s)', { cause: e });
    }
}
export async function AddTodos(todos: any[]) {
    try {
        await db.todos.insertMany(todos);
        return true;
    } catch (e) {
        throw new Error('Error inserting to-do(s)', { cause: e });
    }
}
//#region INSERT

//#region UPDATE
export async function UpdateTodo(id: number, params: any) {
    try {
        return await db.todos.update({ id }, { ...params });
    } catch (e) {
        const message = `Error updating to-do ID: ${id}, params: ${ JSON.stringify(params)}`;
        throw new Error(message, { cause: e});
    }
}
//#region UPDATE

//#region DELETE
export async function DeleteTodo(id: number) {
    try {
        return await db.todos.remove({ id });
    } catch (e) {
        throw new Error(`Error updating to-do ID: ${id}`), { cause: e};
    }
}
//#region DELETE