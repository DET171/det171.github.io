<script lang="ts">
import { onMount } from 'svelte';

import I18nKey from '../i18n/i18nKey';
import { i18n } from '../i18n/translation';
import { getPostUrlBySlug } from '../utils/url-utils';

export let tags: string[];
export let categories: string[];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has('tag') ? params.getAll('tag') : [];
categories = params.has('category') ? params.getAll('category') : [];
const uncategorized = params.get('uncategorized');

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(' ');
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr),
		posts: grouped[Number.parseInt(yearStr)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div class="card-base px-8 py-6">
	{#each groups as group}
		<div>
			<div class="flex h-[3.75rem] w-full flex-row items-center">
				<div
					class="text-75 w-[15%] text-right text-2xl font-bold transition md:w-[10%]"
				>
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div
						class="outline-3 z-50 mx-auto h-3 w-3 rounded-full bg-none
                  outline -outline-offset-[2px] outline-[var(--primary)]"
					></div>
				</div>
				<div class="text-50 w-[70%] text-left transition md:w-[80%]">
					{group.posts.length}
					{i18n(I18nKey.postsCount)}
				</div>
			</div>

			{#each group.posts as post}
				<a
					href={getPostUrlBySlug(post.slug)}
					aria-label={post.data.title}
					class="btn-plain group !block h-10 w-full rounded-lg hover:text-[initial]"
				>
					<div class="flex h-full flex-row items-center justify-start">
						<!-- date -->
						<div
							class="text-50 w-[15%] text-right text-sm transition md:w-[10%]"
						>
							{formatDate(post.data.published)}
						</div>

						<!-- dot and line -->
						<div
							class="dash-line relative flex h-full w-[15%] items-center md:w-[10%]"
						>
							<div
								class="z-50 mx-auto h-1 w-1 rounded bg-[oklch(0.5_0.05_var(--hue))]
                       outline outline-4
                       outline-[var(--card-bg)] transition-all group-hover:h-5
                       group-hover:bg-[var(--primary)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
							></div>
						</div>

						<!-- post title -->
						<div
							class="text-75 w-[70%] overflow-hidden overflow-ellipsis whitespace-nowrap
                     pr-8 text-left font-bold
                     transition-all group-hover:translate-x-1 group-hover:text-[var(--primary)] md:w-[65%] md:max-w-[65%]"
						>
							{post.data.title}
						</div>

						<!-- tag list -->
						<div
							class="text-30 hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-left
                     text-sm transition md:block md:w-[15%]"
						>
							{formatTag(post.data.tags)}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>
