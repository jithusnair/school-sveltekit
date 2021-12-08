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
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import TodoItem from './TodoItem.svelte';

	import { tasks, projects, selectedProjectIndex } from '$lib/store/data';
	import { getTasks, insertTask, TaskDoc } from '$lib/apis/tasks';

	$: if ($projects.length && $selectedProjectIndex !== null) fetchTasks($projects);

	let task = '';

	let isLoading = false;
	let errorMessage = '';
	let tabs = [
		{ icon: 'check_box_outline_blank', label: 'Upcoming' },
		{ icon: 'done', label: 'Completed' },
		{ icon: 'list', label: 'All Tasks' }
	];
	let active = tabs[0];

	let upcomingTasks: Array<TaskDoc>;
	let completedTasks: Array<TaskDoc>;

	let snackbarWithClose: SnackbarComponentDev;

	$: rerenderTabs($tasks);

	function rerenderTabs(tasks: Array<TaskDoc>) {
		upcomingTasks = filterUpcomingTasks(tasks);
		completedTasks = filterCompletedTask(tasks);
	}

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

	function filterUpcomingTasks(allTasks: Array<TaskDoc>) {
		// first filter tasks not done
		let tasksNotDone = allTasks.filter((task) => !task.done);
		let upcomingTasks = tasksNotDone.sort((a, b) => {
			if (a.dueOn && b.dueOn) return b.dueOn.seconds - a.dueOn.seconds;
			else if (!a.dueOn) return 1;
			else if (!b.dueOn) return -1;
			else return 0;
		});

		return upcomingTasks;
	}

	function filterCompletedTask(allTasks: Array<TaskDoc>) {
		let completedTasks = allTasks.filter((task) => task.done);
		return completedTasks;
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

		<TabBar style="grid-column: 1/3" {tabs} let:tab bind:active>
			<Tab {tab}>
				<Icon class="material-icons">{tab.icon}</Icon>
				<Label>{tab.label}</Label>
			</Tab>
		</TabBar>

		{#if active === tabs[0]}
			<List style="grid-column: 1/3">
				{#each upcomingTasks as task, index (task.id)}
					<TodoItem {...task} />
				{:else}
					{#if $tasks.length}
						<h6>You have completed all tasks. That's Awesome!</h6>
					{:else}
						<h6>
							Looks like there are no tasks. Create one by clicking the <strong>+</strong> icon in the
							left panel.
						</h6>
					{/if}
				{/each}
			</List>
		{:else if active === tabs[1]}
			<List style="grid-column: 1/3">
				{#each completedTasks as task, index (task.id)}
					<TodoItem {...task} />
				{:else}
					{#if $tasks.length}
						<h6>You haven't completed a single task. That's sad!</h6>
					{:else}
						<h6>
							Looks like there are no tasks. Create one by clicking the <strong>+</strong> icon in the
							left panel.
						</h6>
					{/if}
				{/each}
			</List>
		{:else}
			<List style="grid-column: 1/3">
				{#each $tasks as task, index (task.id)}
					<TodoItem {...task} />
				{:else}
					<h6>
						Looks like there are no tasks. Create one by clicking the <strong>+</strong> icon in the
						left panel.
					</h6>
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

	h6 {
		text-align: center;
	}
</style>
