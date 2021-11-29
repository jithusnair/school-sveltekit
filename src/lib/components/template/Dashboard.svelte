<script>
	import { leftDrawerOpen, smallScreen } from '$lib/store/drawers';
</script>

<main>
	<slot name="aside" />
	<div class:padding={$leftDrawerOpen && !$smallScreen}>
		<slot />
	</div>
</main>

<style>
	main {
		position: relative;
	}

	.padding {
		padding-left: 256px;
	}

	div {
		margin: 0;
		height: calc(100vh - 64px);
		overflow-y: scroll;
		transition: all 0.3s ease;
	}

	@media only screen and (max-width: 599px) {
		div {
			height: calc(100vh - 56px);
		}
	}
</style>
