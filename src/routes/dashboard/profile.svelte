<script>
	import {
		updateProfile,
		updatePassword,
		reauthenticateWithCredential,
		EmailAuthProvider
	} from '@firebase/auth';
	import { app } from '$lib/configs/firebase';

	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import Snackbar, { Actions, Label } from '@smui/snackbar';

	import { user } from '$lib/store/user';

	let name = $user.displayName;
	let email = $user.email;

	let newPassword = '';
	let oldPassword = '';

	let successMessage = '';
	let errorMessage = '';
	let snackbarWithoutClose;

	let snackbarWithoutClose2;

	async function submit() {
		try {
			await updateProfile($user, {
				displayName: name
			});
			successMessage = 'Successfully update profile';
			snackbarWithoutClose2.open();
		} catch (error) {
			console.error(error);
			errorMessage = error;
			snackbarWithoutClose.open();
		}
	}

	async function changePassword() {
		try {
			await reauthenticateWithCredential(
				$user,
				EmailAuthProvider.credential($user.email, oldPassword)
			);
			await updatePassword($user, newPassword);
			successMessage = 'Successfully updated password';
			snackbarWithoutClose2.open();
		} catch (error) {
			console.error(error);
			errorMessage = error;
			snackbarWithoutClose.open();
		}
	}
</script>

<div class="container">
	<h1>Edit Profile Info</h1>
	<form on:submit|preventDefault={submit}>
		<Textfield type="text" bind:value={name} label="Name" style="min-width: 250px;" />
		<Textfield type="email" bind:value={email} label="Email" style="min-width: 250px;" disabled />
		<Button style="margin: 16px 0" type="submit">Submit</Button>
	</form>
	<hr />
	<h2>Change Password</h2>
	<form on:submit|preventDefault={changePassword}>
		<Textfield
			type="password"
			bind:value={oldPassword}
			label="Old Password"
			style="min-width: 250px;"
		/>
		<Textfield
			type="password"
			bind:value={newPassword}
			label="New Password"
			style="min-width: 250px;"
		/>
		<Button style="margin: 16px 0" type="submit">Submit</Button>
	</form>
</div>

<Snackbar bind:this={snackbarWithoutClose}>
	<Label color="red">{errorMessage}</Label>
</Snackbar>
<Snackbar bind:this={snackbarWithoutClose2}>
	<Label color="red">{successMessage}</Label>
</Snackbar>

<style>
	div {
		margin: 0 auto;
		padding: 0 32px;
		max-width: 500px;
	}

	h1 {
		font-size: 2rem;
		text-align: center;
	}

	form {
		display: grid;
		row-gap: 1rem;
	}

	h2 {
		font-size: 1.5rem;
		text-align: center;
	}
</style>
