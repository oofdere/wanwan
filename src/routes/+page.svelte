<script lang="ts">
	import { settings } from '$lib/settings';
	import { wk, user } from '$lib/wkapia';

	let tokenField: string;
</script>

{#if $wk}
	<div class="container m-auto my-4 flex flex-col gap-4">
		<div class="logo-cloud grid-cols-1 lg:!grid-cols-2 gap-1">
			<a class="logo-item !bg-[#ff00aa]" href="/">
				<p class="h1">0</p>
				<p>Lessons</p>
			</a>
			<a class="logo-item !bg-[#b1b1b1]" href="/">
				<p class="h1">0</p>
				<p>Reviews</p>
			</a>
		</div>

		<div class="logo-cloud grid-cols-1 lg:!grid-cols-5 gap-1">
			<a class="logo-item !bg-[#f600a4]" href="/">
				<p class="h1">0</p>
				<p>Apprentice</p>
			</a>
			<a class="logo-item !bg-[#9331ab]" href="/">
				<p class="h1">0</p>
				<p>Guru</p>
			</a>
			<a class="logo-item !bg-[#4a68e0]" href="/">
				<p class="h1">0</p>
				<p>Master</p>
			</a>
			<a class="logo-item !bg-[#009be9]" href="/">
				<p class="h1">0</p>
				<p>Enlightened</p>
			</a>
			<a class="logo-item !bg-[#484848]" href="/">
				<p class="h1">0</p>
				<p>Burned</p>
			</a>
		</div>
	</div>
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
