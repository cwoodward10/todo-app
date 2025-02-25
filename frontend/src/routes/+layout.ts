import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const todos = await import('$lib/api/todos');
	const apiData = await todos.GetTodos('open', fetch);
	return {
		apiData
	};
};