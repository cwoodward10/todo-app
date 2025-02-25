<script lang="ts">
	import '../styles/app.css';

    import type { LayoutData } from "../$types";
    import { onMount, setContext, type Snippet } from 'svelte';
    import type { Todo } from '$lib/api/todos';

    let { data, children }: { data: LayoutData, children: Snippet } = $props();

    let todos: Todo[] = $state(data?.apiData?.todos ?? []);
    setContext(
        'todos', 
        (add: Todo[] = [], update: Todo[] = []) => {
        if (add.length > 0) {
            todos = [...todos, ...add];
        } 
        if (update.length > 0) {
            const unmodified = todos.filter(t => !update.map(u => u.id).includes(t.id));
            todos = [ ...unmodified, ...update];
        }
        return todos;
    });
</script>

<main>
    {@render children() }
</main>

<style>
    main {
        min-height: 100dvh;
        max-width: min(60rem, 1200px);
        width: 100dvw;

        margin: 0 auto;
        padding: 2rem;
    }
</style>