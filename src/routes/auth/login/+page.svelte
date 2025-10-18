<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, SubmitFunction } from "./$types";
  import { Lock } from "lucide-svelte";

  interface Props {
    form?: ActionData;
  }

  let { form }: Props = $props();
  let loading = $state(false);
  let password = $state("");

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

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2
        class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
      >
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or
        <a
          href="/auth/register"
          class="font-medium text-primary dark:text-secondary hover:text-primary/80 dark:hover:text-secondary/80"
        >
          create a new account
        </a>
      </p>
    </div>

    <form class="mt-8 space-y-6" method="POST" use:enhance={handleSubmit}>
      {#if form?.message !== undefined}
        <div class="success {form?.success ? '' : 'fail'}">
          {form?.message}
        </div>
      {/if}

      <div class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-accent dark:text-white"
            type="email"
            placeholder="Your email"
            value={form?.email ?? ""}
            required
          />
          {#if form?.errors?.email}
            <span
              class="flex items-center text-sm text-red-600 dark:text-red-400 mt-1"
            >
              {form?.errors?.email}
            </span>
          {/if}
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label
              for="password"
              class="block text-sm font-medium dark:text-gray-300"
            >
              Password
            </label>
            <a
              href="/auth/forgot-password"
              class="text-xs text-primary dark:text-secondary hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div class="relative">
            <Lock
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="password"
              type="password"
              bind:value={password}
              required
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-dark-accent dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <a
          href="/auth/register"
          class="font-medium text-primary dark:text-secondary hover:text-primary/80 dark:hover:text-secondary/80"
        >
          Register here
        </a>
      </p>
    </div>
  </div>
</div>
