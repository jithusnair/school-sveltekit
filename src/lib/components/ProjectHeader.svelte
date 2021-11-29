<script lang="ts">
	import IconButton from '@smui/icon-button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Snackbar, {
		Actions as SnackbarActions,
		Label as SnackbarLabel,
		SnackbarComponentDev
	} from '@smui/snackbar';
	import Button, { Label } from '@smui/button';
	import CircularProgress from '@smui/circular-progress';
	import Textfield from '@smui/textfield';

	import { projects, selectedProjectIndex, tasks, selectedTaskIndex } from '$lib/store/data';

	import { updateProject, deleteProject } from '$lib/apis/projects';
	import { deleteTasks } from '$lib/apis/tasks';

	let project = '';
	$: setProject($projects.length, $selectedProjectIndex);

	function setProject(length, value) {
		project = $projects[value]?.name || '';
	}

	let open = false;
	let openDelete = false;
	let snackbarWithClose: SnackbarComponentDev;

	let isLoading = false;
	let errorMessage = '';

	async function edit(event) {
		event.stopPropagation();
		if (project.trim() === '') {
			errorMessage = 'Project name cannot be empty';
			snackbarWithClose.open();
			return;
		}
		isLoading = true;

		try {
			await updateProject($projects[$selectedProjectIndex].id, {
				name: project
			});

			$projects[$selectedProjectIndex].name = project;
			$projects = $projects;
			isLoading = false;
			open = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}

	async function deleteAProject(event) {
		event.stopPropagation();
		try {
			isLoading = true;
			await deleteTasks($tasks);
			await deleteProject($projects[$selectedProjectIndex].id);

			$projects.splice($selectedProjectIndex, 1);
			$projects = $projects;
			if (!$projects.length) {
				$projects = [];
				$tasks = [];
				$selectedProjectIndex = null;
				$selectedTaskIndex = null;
			}
			isLoading = false;
			openDelete = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}
</script>

{#if project}
	<div>
		<h1 style="padding: 0 16px; font-size: 1.25rem; font-weight: 500; line-height: 2">{project}</h1>
		<span>
			<IconButton class="material-icons" on:click={() => (open = true)}>edit</IconButton>
			<IconButton class="material-icons" on:click={() => (openDelete = true)} style="color: red">
				delete
			</IconButton>
		</span>
	</div>
{:else if $projects.length === 0}
	<h1 style="padding: 0 16px; font-size: 1.25rem; font-weight: 500; line-height: 2">
		There are no projects or tasks to display
	</h1>
	<p style="padding: 0 16px;">
		Create a project by clicking the <strong>+</strong> button in the left panel
	</p>
{/if}

<Dialog bind:open aria-labelledby="Add project">
	{#if isLoading}
		<CircularProgress
			style="height: 32px; width: 32px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
			indeterminate
		/>
	{/if}
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title>Edit project</Title>
	<Content>
		<form on:submit|preventDefault={edit}>
			<Textfield
				disabled={isLoading}
				style="width: 100%"
				label="Project Name"
				required
				bind:value={project}
			/>
		</form>
	</Content>
	<Actions>
		<Button disabled={isLoading} on:click>
			<Label>Cancel</Label>
		</Button>
		<Button disabled={isLoading} on:click={edit}>
			<Label>Save</Label>
		</Button>
	</Actions>
</Dialog>

<Dialog bind:open={openDelete} aria-labelledby="Delete project">
	{#if isLoading}
		<CircularProgress
			style="height: 32px; width: 32px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
			indeterminate
		/>
	{/if}
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title>Delete project</Title>
	<Content>
		Are you sure you want to delete <strong>{$projects[$selectedProjectIndex]?.name}</strong> and all
		its tasks
	</Content>
	<Actions>
		<Button disabled={isLoading} on:click>
			<Label>No</Label>
		</Button>
		<Button disabled={isLoading} on:click={deleteAProject}>
			<Label>Yes</Label>
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
	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
	}

	h5 {
		margin: 16px 0;
	}
</style>
