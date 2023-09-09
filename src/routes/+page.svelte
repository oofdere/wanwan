<script lang="ts">
	import { settings } from '$lib/settings';
	import { wk, user } from '$lib/wkapi';

	let tokenField: string;
</script>

{#if $wk}
	{#await $user}
		loading...
	{:then user}
		{#if user}
			<p>{user.data.username}</p>
			<p>level {user.data.level}</p>
			<details>
				<summary>info</summary>
				{JSON.stringify(user)}
			</details>
		{/if}
	{/await}
	<button
		on:click={() => {
			settings.deleteToken();
		}}
		class="btn variant-filled-secondary"
	>
		Log out!
	</button>
{:else}
	<div class="container h-full mx-auto flex justify-center items-center">
		<div class="space-y-10 text-center flex flex-col items-center">
			<div>
				<h1 class="h2">Welcome to wanwan.</h1>
				<h2 class="h4">
					A web-based cross-platform WaniKani client. Kind of like the website, but way nicer.
				</h2>
			</div>

			<aside class="alert variant-ringed-warning">
				<div class="alert-message">
					<h3 class="h4">Warning</h3>
					<p>
						wanwan is a project in active and early development; things will break, so keep that in
						mind while using it. there is no warranty of any kind.
					</p>
					<p>
						an assumption is made that the API key used to log in has been granted all available
						permissions; things might break otherwise.
					</p>
				</div>
			</aside>

			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">WaniKani API v2 key</div>
				<input
					bind:value={tokenField}
					placeholder="Make sure to grant full permissions to the key."
				/>
				<button
					on:click={() => {
						settings.setToken(tokenField);
					}}
					class="variant-filled-secondary">Get started!</button
				>
			</div>
		</div>
	</div>
{/if}
