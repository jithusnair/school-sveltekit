<script lang="ts">
	import List from '@smui/list';
	import Textfield from '@smui/textfield';
	import Fab from '@smui/fab';
	import IconButton from '@smui/icon-button';
	import { Icon } from '@smui/common';
	import Snackbar, {
		Actions as SnackbarActions,
		Label as SnackbarLabel,
		SnackbarComponentDev
	} from '@smui/snackbar';
	import TodoItem from './TodoItem.svelte';

	import { tasks, projects, selectedProjectIndex } from '$lib/store/data';
	import { getTasks, insertTask } from '$lib/apis/tasks';

	$: if ($projects.length && $selectedProjectIndex !== null) fetchTasks($projects);

	let task = '';

	let isLoading = false;
	let errorMessage = '';

	let snackbarWithClose: SnackbarComponentDev;

	async function fetchTasks(projects) {
		$tasks = await getTasks(projects[$selectedProjectIndex].id);
	}

	async function addTask() {
		if (task.trim() === '') {
			errorMessage = 'Task name cannot be empty';
			snackbarWithClose.open();
			return;
		}
		isLoading = true;

		try {
			let docRef = await insertTask($projects[$selectedProjectIndex].id, {
				name: task,
				done: false
			});
			$tasks = [
				{
					id: docRef.id,
					name: task,
					done: false,
					notes: '',
					dueOn: null,
					subtasks: []
				},
				...$tasks
			];
			task = '';
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	function keyDown(event) {
		if (event.key !== 'Enter') return;
		addTask();
	}
</script>

{#if $projects.length !== 0}
	<div>
		<Textfield
			disabled={isLoading}
			variant="outlined"
			bind:value={task}
			label="Add todo"
			on:keydown={keyDown}
		/>
		<Fab on:click={addTask} disabled={isLoading} color="primary" mini>
			<Icon class="material-icons">add</Icon>
		</Fab>

		{#if $tasks.length}
			<List style="grid-column: 1/3">
				{#each $tasks as task, index (task.id)}
					<TodoItem {index} {...task} />
				{/each}
			</List>
		{/if}
	</div>
{/if}

<Snackbar bind:this={snackbarWithClose}>
	<SnackbarLabel>{errorMessage}</SnackbarLabel>
	<SnackbarActions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</SnackbarActions>
</Snackbar>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr max-content;
		align-items: center;
		padding: 0 16px;
		column-gap: 15px;
	}
</style>
