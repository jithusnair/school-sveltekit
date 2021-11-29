<script lang="ts">
	import { onMount } from 'svelte';
	import { signOut, getAuth } from '@firebase/auth';
	import { app } from '$lib/configs/firebase';

	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';

	import { leftDrawerOpen, smallScreen } from '$lib/store/drawers';
	import { darkMode } from '$lib/store/settings';

	export let hideTopBar = false;

	let showDrawerButton = false;

	onMount(() => {
		let darkModeStored = window.localStorage.getItem('darkMode');
		$darkMode = darkModeStored ? darkModeStored : 'yes';

		let media = window.matchMedia('(min-width: 768px)');

		toggleDrawer(media);

		media.addListener(toggleDrawer);

		function toggleDrawer(matchMedia) {
			if (matchMedia.matches) {
				$leftDrawerOpen = true;
				showDrawerButton = false;
				$smallScreen = false;
			} else {
				$leftDrawerOpen = false;
				showDrawerButton = true;
				$smallScreen = true;
			}
		}
	});

	function logout() {
		signOut(getAuth(app));
	}

	function toggleDarkMode() {
		$darkMode = $darkMode === 'yes' ? 'no' : 'yes';
		window.localStorage.setItem('darkMode', $darkMode);
	}

	function toggleDrawer() {
		$leftDrawerOpen = !$leftDrawerOpen;
	}
</script>

{#if !hideTopBar}
	<TopAppBar variant="static">
		<Row>
			<Section>
				{#if showDrawerButton}
					<IconButton on:click={toggleDrawer} class="material-icons">menu</IconButton>
				{/if}
				<Title>TASKR</Title>
			</Section>
			<Section align="end" toolbar>
				<IconButton
					on:click={toggleDarkMode}
					class="material-icons"
					aria-label="Account menu button"
				>
					{#if $darkMode === 'yes'}
						light_mode
					{:else}
						dark_mode
					{/if}
				</IconButton>
				<IconButton on:click={logout} class="material-icons" aria-label="Account menu button">
					logout
				</IconButton>
			</Section>
		</Row>
	</TopAppBar>
{/if}
