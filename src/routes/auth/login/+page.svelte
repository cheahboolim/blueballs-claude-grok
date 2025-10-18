<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();
	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<form class="row flex flex-center" method="POST" use:enhance={handleSubmit}>
	<div class="col-6 form-widget">
		<h1 class="header">Supabase + SvelteKit</h1>
		<p class="description">Sign in via magic link with your email below</p>
		{#if form?.message !== undefined}
			<div class="success {form?.success ? '' : 'fail'}">
				{form?.message}
			</div>
		{/if}
		<div>
			<label for="email">Email address</label>
			<input
				id="email"
				name="email"
				class="inputField"
				type="email"
				placeholder="Your email"
				value={form?.email ?? ''}
			/>
		</div>
		{#if form?.errors?.email}
			<span class="flex items-center text-sm error">
				{form?.errors?.email}
			</span>
		{/if}
		<div>
			<button class="button primary block">
				{loading ? 'Loading' : 'Send magic link'}
			</button>
		</div>
	</div>
</form>
					<div class="flex items-center justify-between mb-2">
						<label for="password" class="block text-sm font-medium dark:text-gray-300">
							Password
						</label>
						<a href="/auth/forgot-password" class="text-xs text-primary dark:text-secondary hover:underline">
							Forgot Password?
						</a>
					</div>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-dark-accent dark:border-gray-600 dark:text-white"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="btn-primary w-full disabled:opacity-50"
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p class="text-center text-sm dark:text-gray-300">
				Don't have an account?
				<a href="/auth/register" class="text-primary dark:text-secondary font-semibold hover:underline">
					Register
				</a>
			</p>
		</div>
	</div>
</div>
