<script lang="ts">
    import { EditTodo, type Todo } from "$lib/api/todos";
    import Checkbox from "../generic/checkbox.svelte";

    interface Props {
        todo: Todo,
    }
    const { todo } = $props();

    const onCheckmarkChange = async (checked: boolean) => {
        const completed = checked ? (new Date()).toDateString() : null;
        const success = await EditTodo(todo.id, { completed });

        if (success) {
            const updated = {
                ...todo,
                completed
            }
        }
    }
</script>

<li class="todo" data-id={todo.id}>
    <Checkbox 
        checked={todo.completed != null}
        onChange={onCheckmarkChange}
    />
    <p class="content">{todo.content}</p>
</li>

<style>
    li.todo {
        display: flex;
        align-items: center;
        gap: 1rem;

        :global(&:has(input:checked)) {
            .content {
                text-decoration: line-through;
                opacity: 50%;
            }
        }
    }
</style>