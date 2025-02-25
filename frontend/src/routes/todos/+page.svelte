<script lang="ts">
    import TodoList from './../../lib/components/todos/TodoList.svelte';

    import { type TodoState } from '$lib/modules/context';
    import { type Todo, type TodoCategory } from '$lib/api/todos';
    import { getContext } from 'svelte';
    
    const todos: TodoState = getContext('todos');

    const categories: { title: string, category: TodoCategory }[] = [
        {
            title: "Today's tasks",
            category: 'day'
        },
        {
            title: "This week's tasks",
            category: 'week'
        },
        {
            title: "This months's tasks",
            category: 'month'
        },
        {
            title: "This year's tasks",
            category: 'year'
        }
    ]
</script>

<div class="container">
    {#each categories as category}
    <TodoList
        title={category.title}
        category={category.category}
        todos={todos().filter(t => t.category === category.category)}

    />
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
</style>