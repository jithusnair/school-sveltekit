<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import List, { Item, Text, Separator, Meta } from '@smui/list';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	import Snackbar, {
		Actions as SnackbarActions,
		Label as SnackbarLabel,
		SnackbarComponentDev
	} from '@smui/snackbar';

	import { updateTask, deleteTask, TaskDoc } from '$lib/apis/tasks';
	import { tasks } from '$lib/store/data';
	import ProjectHeader from './ProjectHeader.svelte';

	export let name = '';
	export let done = false;
	export let id = '';
	export let subtasks = [];
	export let index = 0;

	let open = false;

	let isLoading = false;
	let errorMessage = '';

	let value = name;
	let allSubtasks = [...subtasks];
	let newSubtask = '';

	let snackbarWithClose: SnackbarComponentDev;

	async function toggleDone(event) {
		event.stopPropagation();
		event.preventDefault();
		isLoading = true;
		try {
			await updateTask(id, {
				done: !done
			});
			$tasks[index].done = !done;
			$tasks = [...$tasks];
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	async function editItem(event) {
		event.stopPropagation();
		isLoading = true;
		try {
			let updateData: Partial<TaskDoc> = {
				name: value
			};
			if (allSubtasks.length !== 0) {
				updateData.subtasks = allSubtasks;
				if (isAllSubtaskDone()) {
					updateData.done = true;
				}
			}
			await updateTask(id, updateData);
			$tasks[index].name = value;
			$tasks[index].done = !!updateData.done;
			$tasks = [...$tasks];
			isLoading = false;
			open = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	async function deleteTodo(event) {
		event.stopPropagation();
		isLoading = true;
		try {
			await deleteTask(id);
			$tasks.splice(index, 1);
			$tasks = [...$tasks];
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	function keyupEvent(event) {
		if (event.key === 'Enter') addToSubtasks();
	}

	function addToSubtasks() {
		allSubtasks.push({ name: newSubtask, done: false });
		allSubtasks = [...allSubtasks];
		newSubtask = '';
	}

	function subtaskDone(event, index) {
		event.stopPropagation();
		allSubtasks[index].done = !allSubtasks[index].done;
		allSubtasks = [...allSubtasks];
	}

	function subtaskDelete(event, index) {
		event.stopPropagation();
		allSubtasks.splice(index, 1);
		allSubtasks = [...allSubtasks];
	}

	function prevent_default(event) {
		event.stopPropagation();
	}

	function isAllSubtaskDone() {
		for (const subtask of allSubtasks) {
			if (!subtask.done) return false;
		}
		return true;
	}
</script>

<Item on:click={() => (open = true)}>
	<Checkbox bind:checked={done} on:click={toggleDone} />
	<Text>{name}</Text>
	<Meta on:click={deleteTodo} style="color: red; cursor: pointer;" mini class="material-icons">
		delete_outline
	</Meta>
</Item>
<Separator />

<Dialog
	bind:open
	fullscreen
	aria-labelledby="fullscreen-title"
	aria-describedby="fullscreen-content"
>
	<Header>
		<Textfield bind:value />
	</Header>
	<Content id="fullscreen-content">
		<List>
			{#each allSubtasks as subtask, index}
				<Item nonInteractive>
					<Checkbox on:click={(event) => subtaskDone(event, index)} bind:checked={subtask.done} />
					<Textfield on:click={prevent_default} bind:value={subtask.name} />
					<Meta
						on:click={(event) => subtaskDelete(event, index)}
						style="color: red; cursor: pointer;"
						mini
						class="material-icons"
					>
						delete_outline
					</Meta>
				</Item>
			{/each}
			<!-- <Item nonInteractive> -->
			<Textfield on:keydown={keyupEvent} bind:value={newSubtask} label="Add subtask" />
			<IconButton on:click={addToSubtasks} mini class="material-icons">add</IconButton>
			<!-- </Item> -->
		</List>
	</Content>
	<Actions>
		<Button action="cancel">
			<Label>Cancel</Label>
		</Button>
		<Button action="accept" on:click={editItem}>
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>

<Snackbar bind:this={snackbarWithClose}>
	<SnackbarLabel>{errorMessage}</SnackbarLabel>
	<SnackbarActions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</SnackbarActions>
</Snackbar>

<style>
	/* your styles go here */
</style>
