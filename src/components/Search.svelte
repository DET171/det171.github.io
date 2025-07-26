<script lang="ts">
import I18nKey from '@i18n/i18nKey';
import { i18n } from '@i18n/translation';
import Icon from '@iconify/svelte';
import { url } from '@utils/url-utils.ts';
import { onMount } from 'svelte';
import type { SearchResult } from '@/global';

let keywordDesktop = '';
let keywordMobile = '';
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;

const fakeResult: SearchResult[] = [
	{
		url: url('/'),
		meta: {
			title: 'This Is a Fake Search Result',
		},
		excerpt:
			'Because the search cannot work in the <mark>dev</mark> environment.',
	},
	{
		url: url('/'),
		meta: {
			title: 'If You Want to Test the Search',
		},
		excerpt: 'Try running <mark>npm build && npm preview</mark> instead.',
	},
];

const togglePanel = () => {
	const panel = document.getElementById('search-panel');
	panel?.classList.toggle('float-panel-closed');
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById('search-panel');
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove('float-panel-closed');
	} else {
		panel.classList.add('float-panel-closed');
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else {
			searchResults = fakeResult;
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error('Search error:', error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(async () => {
	pagefindLoaded = typeof window !== 'undefined' && 'pagefind' in window;

	if (import.meta.env.DEV) {
		console.log(
			'Pagefind is not available in development mode. Using mock data.',
		);
	}
});

$: search(keywordDesktop, true);
$: search(keywordMobile, false);
</script>

<!-- search bar for desktop view -->
<div
	id="search-bar"
	class="mr-2 hidden h-11 items-center rounded-lg bg-black/[0.04] transition-all
      focus-within:bg-black/[0.06] hover:bg-black/[0.06] dark:bg-white/5
      dark:focus-within:bg-white/10 dark:hover:bg-white/10 lg:flex
"
>
	<Icon
		icon="material-symbols:search"
		class="pointer-events-none absolute my-auto ml-3 text-[1.25rem] text-black/30 transition dark:text-white/30"
	></Icon>
	<input
		placeholder={i18n(I18nKey.search)}
		bind:value={keywordDesktop}
		on:focus={() => search(keywordDesktop, true)}
		class="h-full w-40 bg-transparent pl-10 text-sm
         text-black/50 outline-0 transition-all focus:w-60 active:w-60 dark:text-white/50"
	/>
</div>

<!-- toggle btn for phone/tablet view -->
<button
	on:click={togglePanel}
	aria-label="Search Panel"
	id="search-switch"
	class="btn-plain scale-animation h-11 w-11 rounded-lg active:scale-90 lg:!hidden"
>
	<Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div
	id="search-panel"
	class="float-panel float-panel-closed search-panel absolute left-4
right-4 top-20 rounded-2xl p-2 shadow-2xl md:left-[unset] md:w-[30rem]"
>
	<!-- search bar inside panel for phone/tablet -->
	<div
		id="search-bar-inside"
		class="relative flex h-11 items-center rounded-xl bg-black/[0.04] transition-all
      focus-within:bg-black/[0.06] hover:bg-black/[0.06] dark:bg-white/5
      dark:focus-within:bg-white/10 dark:hover:bg-white/10 lg:hidden
  "
	>
		<Icon
			icon="material-symbols:search"
			class="pointer-events-none absolute my-auto ml-3 text-[1.25rem] text-black/30 transition dark:text-white/30"
		></Icon>
		<input
			placeholder="Search"
			bind:value={keywordMobile}
			class="absolute inset-0 bg-transparent pl-10 text-sm text-black/50
               outline-0 focus:w-60 dark:text-white/50"
		/>
	</div>

	<!-- search results -->
	{#each result as item}
		<a
			href={item.url}
			class="group block rounded-xl px-3 py-2
       text-lg transition first-of-type:mt-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] lg:first-of-type:mt-0"
		>
			<div
				class="text-90 inline-flex font-bold transition group-hover:text-[var(--primary)]"
			>
				{item.meta.title}<Icon
					icon="fa6-solid:chevron-right"
					class="my-auto translate-x-1 text-[0.75rem] text-[var(--primary)] transition"
				></Icon>
			</div>
			<div class="text-50 text-sm transition">
				{@html item.excerpt}
			</div>
		</a>
	{/each}
</div>

<style>
	input:focus {
		outline: 0;
	}
	.search-panel {
		max-height: calc(100vh - 100px);
		overflow-y: auto;
	}
</style>
