<script lang="ts">
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
	import { app } from '$lib/configs/firebase';

	let email = '';
	let password = '';
	let confirmPassword = '';

	let errorMessage = '';
	let snackbarWithoutClose;

	async function submit(event) {
		if (password !== confirmPassword) {
			errorMessage = 'Passwords must be the same';
			snackbarWithoutClose.open();
			return;
		}
		try {
			await createUserWithEmailAndPassword(getAuth(app), email, password);
		} catch (error) {
			console.error(error);
			if (error.message.includes('auth/email-already-in-use')) {
				errorMessage = 'Email already in use';
				snackbarWithoutClose.open();
				return;
			}
			errorMessage = error.message;
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
	<Textfield
		style="min-width: 250px"
		label="Confirm Password"
		type="password"
		required
		bind:value={confirmPassword}
	/>

	<Button type="submit">Sign Up</Button>
	<small>Already registered? <a href="/login">Login</a></small>
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
