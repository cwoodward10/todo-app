import type { Todo } from "$lib/api/todos";

export type TodoState = (add?: Todo[], update?: Todo[]) => Todo[];