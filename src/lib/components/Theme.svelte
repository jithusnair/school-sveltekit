<script>
	import { darkMode } from '$lib/store/settings';
</script>

<!-- 
  If nothing is stored in localStorage everything 
  will default to darkmode.

  darkMode is also controlled and stored in 
  window.localStorage via TopBar.svelte file
-->

<svelte:head>
	<!-- SMUI Styles -->
	{#if $darkMode === 'no'}
		<link rel="stylesheet" href="/smui.css" />
	{:else}
		<link rel="stylesheet" href="/smui-dark.css" />
	{/if}
</svelte:head>
