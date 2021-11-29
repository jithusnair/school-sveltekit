<script lang="ts">
	import { onMount } from 'svelte';
	import Drawer, { Content as DrawerContent, Header, Title as DrawerTitle } from '@smui/drawer';
	import List, { Item, Text, Meta } from '@smui/list';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import IconButton from '@smui/icon-button';
	import Snackbar, {
		Actions as SnackbarActions,
		Label as SnackbarLabel,
		SnackbarComponentDev
	} from '@smui/snackbar';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';

	import { leftDrawerOpen } from '$lib/store/drawers';
	import { user } from '$lib/store/user';
	import { projects, selectedProjectIndex } from '$lib/store/data';

	import { getProjects, insertProject } from '$lib/apis/projects';

	onMount(async () => {
		$projects = await getProjects($user.uid);
		if (!$selectedProjectIndex) {
			$selectedProjectIndex = 0;
		}
	});

	let project = '';

	let open = false;

	let isLoading = false;

	let errorMessage = '';
	let snackbarWithClose: SnackbarComponentDev;

	async function submit(event) {
		event.stopPropagation();
		if (project.trim() === '') {
			errorMessage = 'Project name cannot be empty';
			snackbarWithClose.open();
			return;
		}
		isLoading = true;

		try {
			let docRef = await insertProject($user.uid, {
				name: project
			});
			$projects = [
				{
					id: docRef.id,
					name: project,
					userId: $user.uid
				},
				...$projects
			];
			isLoading = false;
			open = false;
		} catch (error) {
			isLoading = false;
			console.error(error);
			errorMessage = error.message;
			snackbarWithClose.open();
		}
	}
</script>

<Drawer fixed variant="dismissible" bind:open={$leftDrawerOpen}>
	<Header>
		<DrawerTitle>Projects</DrawerTitle>
	</Header>
	<DrawerContent>
		<List>
			{#each $projects as project, index (project.id)}
				<Item
					on:click={() => ($selectedProjectIndex = index)}
					activated={index === $selectedProjectIndex}
				>
					<Text>{project.name}</Text>
				</Item>
			{/each}
		</List>
	</DrawerContent>
	<List>
		<Item on:click={() => (open = true)}>
			<Text>Add New Project</Text>
			<Meta class="material-icons">add</Meta>
		</Item>
	</List>
</Drawer>

<Dialog bind:open aria-labelledby="Add project">
	{#if isLoading}
		<CircularProgress
			style="height: 32px; width: 32px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
			indeterminate
		/>
	{/if}
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title>Add project</Title>
	<Content>
		<form on:submit|preventDefault={submit}>
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
			<Label>No</Label>
		</Button>
		<Button disabled={isLoading} on:click={submit}>
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
