<script lang="ts">
	import type { PageData } from './$types';

	import { wk } from '$lib/wk';
	import { AppBar } from '@skeletonlabs/skeleton';

	export let data: PageData;

	const subject = $wk?.subjects.get(Number(data.id));
</script>

{#if $wk}
	{#await subject}
		Loading...
	{:then s}
		<AppBar>
			<svelte:fragment slot="lead">(back)</svelte:fragment>
			<h1 class="h1">
				{s?.data.data.characters}
				{s?.data.data.meanings[0].meaning}
			</h1>
			<svelte:fragment slot="trail">
				<div class="flex flex-col">
					<p>level {s?.data.data.level}</p>
					<p>{s?.data.kind}</p>
				</div>
			</svelte:fragment>
		</AppBar>
		{JSON.stringify(s)}
		{s?.data.kind}
	{/await}
{/if}
