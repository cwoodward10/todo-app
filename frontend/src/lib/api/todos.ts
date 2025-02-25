import { ApiUrl } from "./api";

export type TodoCategory = 'day' | 'week' | 'month' | 'year';
export type Todo = {
    id?: number;
    content: string;
    created: Date;
    category: TodoCategory;
    completed?: Date;
    repeatable?: number
}

export async function GetTodos(
    type: 'all' | 'open' | 'completed',
    sk_fetch: any = undefined,
    id: number | undefined = undefined
) {
    const url = id == null ? `todos?type=${type}` : `todos/${id}`;
    const fetchFunc = sk_fetch ?? fetch;

    try {
        const response = await fetchFunc(
            ApiUrl(url), 
            { 
                method: 'GET'
            }
        );
    
        return await response.json() as Todo[];
    } catch (e) {
        console.error(`Erro getting to-dos: ${e}`);
        return [];
    }
}

export async function CreateTodo(
    content: string,
    category: TodoCategory,
    sk_fetch?: () => Promise<Response>
) {
    const fetchFunc = sk_fetch ?? fetch;

    const todo: Todo = {
        content,
        category,
        created: new Date(),
    }

    try {
        const response = await fetchFunc(
            ApiUrl('todos'), 
            { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            }
        );
        const res = await response;
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        
        const rData = await res.json();
        const id = rData.id as number;
        todo.id = id;

        return todo;
    } catch (e) {
        console.error(`Error saving to-do: ${e}`);

        return null;
    }
}

export async function EditTodo(id: number, params: any) {
    try {
        console.log(JSON.stringify(params))
        const response = await fetch(
            ApiUrl(`todos/${id}`), 
            { 
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            }
        );
        console.log(response)
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return true;
    } catch (e) {
        console.error(`Error saving to-do: ${e}`);

        return false;
    }
}