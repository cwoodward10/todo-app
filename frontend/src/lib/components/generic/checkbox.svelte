<script lang="ts">
    interface Props {
        checked: boolean;
        onChange: (checked: boolean) => void
    }
    const { checked, onChange } = $props();

    const handleChange = (e: Event) => {
        e.preventDefault();

        onChange((e.target as HTMLInputElement)?.checked);
    }
</script>

<label class="checkbox-container">
    <input 
        type="checkbox" 
        checked={checked}
        onchange={handleChange}
    />
    <span class="checkmark"></span>
</label>

<style>
    .checkbox-container {
        --size: 1.5rem;
        --border-width: calc(var(--size) / 8);

        display: block;
        position: relative;

        aspect-ratio: 1 / 1;
        height: var(--size);
        width: var(--size);

        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        .checkmark {
            position: absolute;
            top: 0;
            left: 0;

            height: var(--size);
            width: var(--size);
            aspect-ratio: 1 / 1;

            background-color: #eee;
        }

        &:hover input ~ .checkmark {
            background-color: #ccc;
        }

        input:checked ~ .checkmark {
            background-color: #2196f3;
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        input:checked ~ .checkmark:after {
            display: block;
        }

        .checkmark:after {
            left: 52%;
            top: 48%;
            translate: -50% -50%;

            width: calc(var(--size) / 4);
            height: calc(var(--size) / 2);;

            border: solid white;
            border-width: 0 var(--border-width) var(--border-width) 0;

            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
    }
</style>
