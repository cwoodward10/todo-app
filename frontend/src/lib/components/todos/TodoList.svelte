<script lang="ts">
	import TodoItem from './TodoItem.svelte';
	import TodoCreater from './TodoCreater.svelte';

    import { getContext } from 'svelte';

	import { CreateTodo, type Todo, type TodoCategory} from "$lib/api/todos";
    import type { TodoState } from '$lib/modules/context';

    interface Props {
		todos: Todo[];
        category: TodoCategory;
        title: string;
	}
	let { 
		todos,
		category, 
		title
	}: Props = $props();

	const tdState: TodoState = getContext('todos');
	const handleTodoCreated = (add: Todo) => {
        tdState([add]);
    }

	let isCreatingTodo = $state(false);

	const onCreate = async (content: string) => {
		try {
			const created = await CreateTodo(content, category);
			created && handleTodoCreated(created);
		} catch (e) {
			console.error(`Error submitting new todo: ${e}`);
		}

		isCreatingTodo = false;
	}
	const onCancel = () => isCreatingTodo = false;
</script>

<section class="{category}">
	<h2>{title}</h2>
	<ul>
		{#each todos as todo}
		<TodoItem {todo} />
		{/each}
		{#if isCreatingTodo}
		<TodoCreater
			{onCreate}
			{onCancel}
		/>
		{:else}
		<button 
			class="add-todo"
			onclick={() =>{ isCreatingTodo = true; } }
		>
			Add task
		</button>
		{/if}
	</ul>
</section>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 0;
	}

	button.add-todo {
		width: fit-content;
		padding: 0.25rem 0.5rem;
	}
</style>