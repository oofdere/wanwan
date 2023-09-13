<script lang="ts">
	import { AppBar, ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { wk, user } from '$lib/wk';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<a href="/">
			<strong class="text-xl">wanwan <span class="badge variant-filled">alpha</span></strong>
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		{#await $user}
			<ProgressRadial class="w-8" stroke={100} />
		{:then user}
			{#if user}
				<div class="flex flex-col gap-2">
					{user.data.username} • level {user.data.level}
					<progress max={60} value={user.data.level} />
				</div>
			{/if}
		{/await}
	</svelte:fragment>
</AppBar>
