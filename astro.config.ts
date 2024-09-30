import fs from 'node:fs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import remarkUnwrapImages from 'remark-unwrap-images';

import { expressiveCodeOptions } from './src/site.config';
import { remarkReadingTime } from './src/utils/remark-reading-time';

// https://astro.build/config
export default defineConfig({
	image: {
		domains: ['webmention.io'],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		mdx(),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ['nofollow, noopener, noreferrer'],
					target: '_blank',
				},
			],
		],
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [''],
			},
		},
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	// ! Please remember to replace the following site property with your own domain
	site: 'https://canaris.is-a.dev',
	vite: {
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
		plugins: [rawFonts(['.ttf', '.woff'])],
	},
});

function rawFonts(ext: string[]) {
	return {
		name: 'vite-plugin-raw-fonts',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
