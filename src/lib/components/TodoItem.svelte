<script lang="ts">
	import Checkbox from '@smui/checkbox';
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import List, { Item, Separator, Meta, Text, PrimaryText, SecondaryText } from '@smui/list';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	import Snackbar, {
		Actions as SnackbarActions,
		Label as SnackbarLabel,
		SnackbarComponentDev
	} from '@smui/snackbar';
	import DateTime from './DateTime.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import { Timestamp } from '@firebase/firestore';

	import { updateTask, deleteTask, TaskDoc } from '$lib/apis/tasks';
	import { tasks } from '$lib/store/data';

	export let name = '';
	export let notes = '';
	export let done = false;
	export let id = '';
	export let subtasks = [];
	export let dueOn: Timestamp | null = null;
	export let subtasksDoneCount: number | null = null;
	export let color = '';

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
	$: doneCountValue = subtasksDoneCount;
	let colorValue = color;

	let snackbarWithClose: SnackbarComponentDev;

	async function toggleDone(event) {
		event.stopPropagation();
		event.preventDefault();
		isLoading = true;
		try {
			await updateTask(id, {
				done: !isDone
			});
			let index = indexFromTaskId(id);
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
				dueOn: dateValue ? new Timestamp(dateValue.getTime() / 1000, 0) : null,
				color: colorValue || ''
			};
			updateData.subtasks = allSubtasks;
			let checkSubtasks = isAllSubtaskDoneAndCountDone();
			if (checkSubtasks !== null && checkSubtasks.allSubtasksDone) {
				updateData.done = true;
				updateData.subtasksDoneCount = checkSubtasks.countSubtasksDone;
			} else if (checkSubtasks !== null && !checkSubtasks.allSubtasksDone) {
				updateData.subtasksDoneCount = checkSubtasks.countSubtasksDone;
			}
			await updateTask(id, updateData);
			let index = indexFromTaskId(id);
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
		$tasks[index].subtasksDoneCount = updatedData.subtasksDoneCount;
		$tasks[index].color = updatedData.color;
		$tasks = [...$tasks];
	}

	async function deleteTodo(event) {
		event.stopPropagation();
		isLoading = true;
		try {
			await deleteTask(id);
			let index = indexFromTaskId(id);
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

	function isAllSubtaskDoneAndCountDone(): {
		allSubtasksDone: boolean;
		countSubtasksDone: number;
	} | null {
		let allSubtasksDone = true;
		let countSubtasksDone = 0;
		if (allSubtasks.length === 0) return null;
		for (const subtask of allSubtasks) {
			if (subtask.done) countSubtasksDone++;
			if (!subtask.done) allSubtasksDone = false;
		}
		return { allSubtasksDone, countSubtasksDone };
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
				colorValue = color;
				break;
		}
	}

	function indexFromTaskId(id: String): number | null {
		for (let index = 0; index < $tasks.length; index++) {
			if ($tasks[index].id === id) return index;
		}
		return null;
	}

	function openEditWindow() {
		open = true;
		clear = false;
	}
</script>

<Item
	style={`border-left: ${colorValue ? '16px solid ' + colorValue : '16px solid transparent'};`}
	on:click={openEditWindow}
>
	<Checkbox bind:checked={isDone} on:click={toggleDone} />
	<Text>
		<PrimaryText>
			{name}
		</PrimaryText>
		<SecondaryText style={`${!allSubtasks.length ? 'opacity: 0.4' : ''}`}>
			{#if allSubtasks.length}
				{doneCountValue} of {allSubtasks.length}
			{:else}
				0 subtasks
			{/if}
		</SecondaryText>
	</Text>
	<Meta on:click={deleteTodo} style="color: red; cursor: pointer;" mini class="material-icons">
		delete_outline
	</Meta>
</Item>
<Separator />

<Dialog
	on:SMUIDialog:closed={dialogCloseHandler}
	scrimClickAction=""
	escapeKeyAction=""
	bind:open
	aria-labelledby="fullscreen-title"
	aria-describedby="fullscreen-content"
>
	<Header class="header" style={`border-top: ${colorValue ? '16px solid ' + colorValue : ''}`}>
		<Textfield bind:value />
		<ColorPicker value={colorValue} on:select={(event) => (colorValue = event.detail)} />
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
	:global(.header) {
		padding: 0 24px;
		margin-bottom: 16px;
		display: flex;
		justify-content: space-between;
		align-items: end;
	}
</style>
