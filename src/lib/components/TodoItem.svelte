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
	import DateTime from './DateTime.svelte';
	import { Timestamp } from '@firebase/firestore';

	import { updateTask, deleteTask, TaskDoc } from '$lib/apis/tasks';
	import { tasks } from '$lib/store/data';

	export let name = '';
	export let notes = '';
	export let done = false;
	export let id = '';
	export let subtasks = [];
	export let index = 0;
	export let dueOn: Timestamp | null = null;

	let open = false;

	let isLoading = false;
	let errorMessage = '';
	let clear = false;

	let value = name;
	$: isDone = done;
	let description = notes;
	let allSubtasks = subtasks.length ? JSON.parse(JSON.stringify(subtasks)) : [];
	let newSubtask = '';
	let dateValue = dueOn ? dueOn.toDate() : null;

	let snackbarWithClose: SnackbarComponentDev;

	async function toggleDone(event) {
		event.stopPropagation();
		event.preventDefault();
		isLoading = true;
		try {
			await updateTask(id, {
				done: !isDone
			});
			$tasks[index].done = !isDone;
			$tasks = [...$tasks];
			isLoading = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	async function editItem() {
		isLoading = true;
		try {
			let updateData: Partial<TaskDoc> = {
				name: value,
				notes: description,
				done: isDone,
				dueOn: dateValue ? new Timestamp(dateValue.getTime() / 1000, 0) : null
			};
			updateData.subtasks = allSubtasks;
			if (isAllSubtaskDone()) {
				updateData.done = true;
			}
			await updateTask(id, updateData);
			update$Tasks(updateData, index);
			isLoading = false;
			open = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	function update$Tasks(updatedData: Partial<TaskDoc>, index: number) {
		$tasks[index].name = updatedData.name;
		$tasks[index].done = !!updatedData.done;
		$tasks[index].notes = updatedData.notes;
		$tasks[index].dueOn = updatedData.dueOn;
		$tasks[index].subtasks = updatedData.subtasks;
		$tasks = [...$tasks];
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
		if (allSubtasks.length === 0) return false;
		for (const subtask of allSubtasks) {
			if (!subtask.done) return false;
		}
		return true;
	}

	function dialogCloseHandler(event) {
		switch (event.detail.action) {
			case 'save':
				editItem();
				break;
			default:
				// This means the user clicked the scrim, pressed
				// cancel or pressed Esc to close the dialog.
				value = name;
				description = notes;
				isDone = done;
				allSubtasks = subtasks.length ? JSON.parse(JSON.stringify(subtasks)) : [];
				newSubtask = '';
				clear = true;
				dateValue = dueOn ? dueOn.toDate() : null;
				break;
		}
	}

	function openEditWindow() {
		open = true;
		clear = false;
	}
</script>

<Item on:click={openEditWindow}>
	<Checkbox bind:checked={isDone} on:click={toggleDone} />
	<Text>{name}</Text>
	<Meta on:click={deleteTodo} style="color: red; cursor: pointer;" mini class="material-icons">
		delete_outline
	</Meta>
</Item>
<Separator />

<Dialog
	on:SMUIDialog:closed={dialogCloseHandler}
	bind:open
	aria-labelledby="fullscreen-title"
	aria-describedby="fullscreen-content"
>
	<Header style="padding: 0 24px; margin-bottom: 16px">
		<Textfield bind:value />
	</Header>
	<Content id="fullscreen-content">
		<List>
			<Textfield
				style="display: block; margin-bottom: 16px;"
				input$rows={4}
				input$cols={32}
				textarea
				label="Notes"
				bind:value={description}
			/>
			<DateTime {clear} date={dateValue} on:date={(event) => (dateValue = event.detail)} />
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
		<Button action="save">
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
