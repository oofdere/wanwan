<script>
	import { wk } from '$lib/wk';
	import { summary } from '$lib/wkapi/summary';
	import { CodeBlock, TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
	import { date } from 'zod';
</script>

<div class="container m-auto py-4">
	<h1 class="h1">debug</h1>
	<hr />

	<p>
		this page is used to test the WaniKani API integration during development, feel free to ignore.
	</p>

	{#if $wk}
		<p>
			WaniKani API Key:
			<span class="opacity-0 hover:opacity-100 code">
				{$wk.token}
			</span>
		</p>

		<hr class="my-2" />

		<h2 class="h2">summary</h2>

		{#await $wk.summary.get() then summary}
			<TreeView>
				<TreeViewItem>
					{summary.data.lessons.length} Lessons
					<svelte:fragment slot="children">
						{#each summary.data.lessons as lesson}
							<TreeViewItem>
								<CodeBlock language="json" code={JSON.stringify(lesson)} />
							</TreeViewItem>
						{/each}
					</svelte:fragment>
				</TreeViewItem>
				<TreeViewItem>
					{summary.data.reviews.length} Reviews
					<svelte:fragment slot="children">
						{#each summary.data.reviews as review}
							<TreeViewItem>
								<CodeBlock language="json" code={JSON.stringify(review)} />
							</TreeViewItem>
						{/each}
					</svelte:fragment>
				</TreeViewItem>
			</TreeView>

			<CodeBlock language="json" code={JSON.stringify(summary)} />
		{/await}

		<hr class="my-2" />

		<h2 class="h2">user</h2>

		{#await $wk.user.get() then res}
			<CodeBlock language="json" code={JSON.stringify(res)} />
		{/await}

		<hr class="my-2" />

		<h2 class="h2">voice actors</h2>

		{#await $wk.voice_actors.getAll() then res}
			<CodeBlock language="json" code={JSON.stringify(res)} />
		{/await}
	{/if}
</div>
