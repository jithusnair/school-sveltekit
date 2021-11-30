<script lang="ts">
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
	import { app } from '$lib/configs/firebase';

	let email = '';
	let password = '';

	let errorMessage = '';
	let snackbarWithoutClose;

	async function submit(event) {
		try {
			await signInWithEmailAndPassword(getAuth(app), email, password);
		} catch (error) {
			console.error(error);
			errorMessage = error;
			snackbarWithoutClose.open();
		}
	}
</script>

<form on:submit|preventDefault={submit}>
	<Textfield style="min-width: 250px" label="Email" type="email" required bind:value={email} />
	<Textfield
		style="min-width: 250px"
		label="Password"
		type="password"
		required
		bind:value={password}
	/>

	<Button type="submit">Login</Button>
	<small>Not registered? <a href="/signup">Sign Up</a></small>
</form>

<Snackbar bind:this={snackbarWithoutClose}>
	<Label color="red">{errorMessage}</Label>
</Snackbar>

<style>
	form {
		display: grid;
		height: 100%;
		row-gap: 1rem;
		place-content: center;
	}

	small {
		justify-self: center;
		margin: 0;
	}
</style>
