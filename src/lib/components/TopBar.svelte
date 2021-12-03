<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { signOut, getAuth } from '@firebase/auth';
	import { app } from '$lib/configs/firebase';

	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import MenuSurface, { MenuSurfaceComponentDev } from '@smui/menu-surface';
	import List, { Item, Separator, Text, Meta } from '@smui/list';

	import { leftDrawerOpen, smallScreen } from '$lib/store/drawers';
	import { darkMode } from '$lib/store/settings';
	import { goto } from '$app/navigation';

	export let hideTopBar = false;

	let showDrawerButton = false;

	let menu: MenuSurfaceComponentDev;

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

	function profileEdit() {
		goto('/dashboard/profile');
		menu.setOpen(false);
	}
</script>

{#if !hideTopBar}
	<TopAppBar variant="static">
		<Row>
			<Section>
				{#if showDrawerButton && $page.path !== '/dashboard/profile'}
					<IconButton on:click={toggleDrawer} class="material-icons">menu</IconButton>
				{/if}
				<Title on:click={() => goto('/dashboard')} style="cursor: pointer">TASKR</Title>
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
				<div>
					<MenuSurface bind:this={menu}>
						<List>
							<Item on:click={profileEdit}>
								<Text>Profile Settings</Text>
							</Item>
							<Separator />
							<Item on:click={logout}>
								<Text>Log out</Text>
							</Item>
						</List>
					</MenuSurface>
				</div>
				<IconButton
					on:click={() => menu.setOpen(true)}
					class="material-icons"
					aria-label="Account menu button"
				>
					person
				</IconButton>
			</Section>
		</Row>
	</TopAppBar>
{/if}
