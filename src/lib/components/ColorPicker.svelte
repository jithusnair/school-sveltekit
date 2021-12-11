<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Dialog, { Content } from '@smui/dialog';
	import colors from './colors';

	let dispatch = createEventDispatcher();

	export let value = null;

	let open = false;

	function selectedColor(color: string) {
		open = false;
		dispatch('select', color);
	}
</script>

<div
	on:click={() => (open = true)}
	class="selected"
	class:nil={!value}
	style={`background-color: ${value ? value : 'rgba(128, 128, 128, 0.5)'}`}
>
	{!value ? '-' : ''}
</div>

<Dialog
	on:SMUIDialog:closed={(event) => event.stopPropagation()}
	bind:open
	aria-labelledby="list-title"
	aria-describedby="list-content"
>
	<Content id="list-content">
		<div class="container">
			{#each colors as color}
				<div
					on:click={() => selectedColor(color)}
					class="color"
					style={`background-color: ${color}`}
				/>
			{/each}
			<div
				on:click={() => selectedColor('')}
				class="color nil"
				style={`background-color: 'rgba(128, 128, 128, 0.5)'`}
			>
				X
			</div>
		</div>
	</Content>
</Dialog>

<style>
	.color,
	.selected {
		width: 32px;
		height: 32px;
		cursor: pointer;
	}

	.container {
		background-color: var(--mdc-theme-surface);
		display: grid;
		grid-template-columns: repeat(5, 50px);
		column-gap: 16px;
		row-gap: 16px;
	}

	.nil {
		background-color: rgba(128, 128, 128, 0.5);
		display: grid;
		place-items: center;
	}
</style>
