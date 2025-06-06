import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const contentDir = (dir: string) =>
	pathToFileURL(path.resolve(import.meta.dirname, './content', dir)).href;

const postsCollection = defineCollection({
	loader: glob({
		pattern: '**/[^_]*.{md,mdx}',
		base: contentDir('posts'),
	}),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(''),
		image: z.string().optional().default(''),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(''),
		lang: z.string().optional().default(''),

		/* For internal use */
		prevTitle: z.string().default(''),
		prevSlug: z.string().default(''),
		nextTitle: z.string().default(''),
		nextSlug: z.string().default(''),
	}),
});

const specCollection = defineCollection({
	loader: glob({
		pattern: '**/[^_]*.{md,mdx}',
		base: contentDir('spec'),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
