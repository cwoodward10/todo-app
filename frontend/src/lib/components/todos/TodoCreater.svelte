<script lang="ts">
	import { Icon, XMark, Cog6Tooth, Check } from 'svelte-hero-icons';

    interface Props {
        onCreate: (content: string) => void;
        onCancel: () => void
    }
    const { onCreate, onCancel } = $props();

    let todoCreater: HTMLFormElement;
    
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        if (!todoCreater) {
            return null;
        }

		const data = new FormData(todoCreater);
		const raw = data?.get('content') as string;

        if (!raw) {
            return null;
        }

        onCreate(raw.trim());
    }
</script>

<div class="creater">
    <form 
        bind:this={todoCreater}
        title="create task"
        onsubmit={onSubmit}
    >
        <input 
            type="text" 
            name="content" 
            placeholder="Some task"
            required
        />
        <button type="submit" aria-label="submit">
            <Icon src={Check} />
        </button>
        <button 
            aria-label="cancel"
            onclick={ onCancel }
        >
            <Icon src={XMark} />
        </button>
    </form>
    <button aria-label="advanced task creation">
        <Icon src={Cog6Tooth} />
    </button>
</div>

<style>
    .creater {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		form {
			display: contents;
		}
	}
</style>