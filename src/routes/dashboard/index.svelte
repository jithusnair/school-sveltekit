<script lang="ts">
	import { app } from '$lib/configs/firebase';

	import ProjectsDrawer from '$lib/components/ProjectsDrawer.svelte';
	import ProjectHeader from '$lib/components/ProjectHeader.svelte';
	import TodoList from '$lib/components/TodoList.svelte';

	import Dashboard from '$lib/components/template/Dashboard.svelte';
	import { user } from '$lib/store/user';

	let task = '';
</script>

<Dashboard>
	<svelte:fragment slot="aside">
		<ProjectsDrawer />
	</svelte:fragment>
	<ProjectHeader />
	<hr />
	<TodoList />
</Dashboard>

<style>
	hr {
		margin: 16px 0 48px 0;
	}
</style>
