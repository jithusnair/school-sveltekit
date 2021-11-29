<script lang="ts">
	import { getAuth, onAuthStateChanged } from '@firebase/auth';
	import { goto } from '$app/navigation';
	import Theme from '$lib/components/Theme.svelte';
	import { app } from '$lib/configs/firebase';
	import { user } from '$lib/store/user';
	import { darkMode } from '$lib/store/settings';
	import { get } from 'svelte/store';

	let checkedLoginState = false;

	onAuthStateChanged(getAuth(app), async (userData) => {
		if (userData) {
			await goto('/dashboard', { replaceState: true });
			$user = userData;
		} else {
			await goto('/login', { replaceState: true });
		}
		checkedLoginState = true;
	});

	$darkMode = window.localStorage.getItem('darkMode');
</script>

<Theme />
{#if checkedLoginState}
	<slot />
{/if}
