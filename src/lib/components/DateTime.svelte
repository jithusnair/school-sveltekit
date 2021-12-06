<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import flatpickr from 'flatpickr';
	import type { Instance } from 'flatpickr/dist/types/instance';
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import { Icon } from '@smui/common';

	import { darkMode } from '$lib/store/settings';

	let picker: () => HTMLInputElement;
	let pickerInstance: Instance;
	let dispatch = createEventDispatcher();

	export let date: Date | null = null;
	export let clear = false;

	let value = date;

	$: if (clear && pickerInstance) {
		value = date;
		pickerInstance.setDate(date);
	}

	onMount(() => {
		pickerInstance = flatpickr(picker(), {
			altFormat: 'j M, Y H:i K',
			altInput: true,
			enableTime: true
		});
		pickerInstance.setDate(value);

		pickerInstance.config.onValueUpdate.push((selectedDates) => {
			value = selectedDates[0];
			dispatch('date', value);
		});
	});

	function clearDate() {
		pickerInstance.setDate(null);
		value = null;
		dispatch('date', value);
	}
</script>

<svelte:head>
	{#if $darkMode === 'yes'}
		<link rel="stylesheet" href="/flatpickr-dark.css" />
	{:else}
		<link rel="stylesheet" href="/flatpickr.css" />
	{/if}
</svelte:head>

<Paper
	style="cursor: pointer; padding: 0;  display: grid; grid-template-columns: 1fr 50px 50px; column-gap: 10px; align-items: center"
>
	<Input
		class="input"
		on:click={() => pickerInstance.open()}
		bind:getElement={picker}
		type="text"
		placeholder="Due on"
	/>
	{#if value}
		<Icon
			style="justify-self: center; grid-column-start: 2;"
			on:click={clearDate}
			class="material-icons">clear</Icon
		>
	{/if}
	<Icon
		style="justify-self: center; grid-column-start: 3;"
		on:click={() => pickerInstance.open()}
		class="material-icons"
	>
		event
	</Icon>
</Paper>

<style>
	:global(.input) {
		padding: 16px !important; /* to override smui style */
		color: var(--mdc-theme-on-surface);
		cursor: pointer;
	}

	:global(input.input::placeholder) {
		visibility: visible;
		color: var(--mdc-theme-on-surface);
		opacity: 0.5;
	}
</style>
