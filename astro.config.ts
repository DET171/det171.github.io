import { defineConfig, envField, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';
import remarkCollapse from 'remark-collapse';
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { transformerFileName } from './src/utils/transformers/fileName';
import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
	site: SITE.website,
	integrations: [
		mdx({
			extendMarkdownConfig: true,
		}),
		sitemap({
			filter: page => SITE.showArchives || !page.endsWith('/archives'),
		}),
	],
	experimental: {
		rustCompiler: true,
	},
	markdown: {
		// remarkPlugins: [remarkToc, [remarkCollapse, { test: 'Table of contents' }]],
		processor: unified({
			remarkPlugins: [
				remarkToc,
				[remarkCollapse, { test: 'Table of contents' }],
			],
		}),
		shikiConfig: {
			// For more themes, visit https://shiki.style/themes
			themes: { light: 'catppuccin-latte', dark: 'andromeeda' },
			defaultColor: false,
			wrap: false,
			transformers: [
				transformerFileName({ style: 'v2', hideDot: false }),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationDiff({ matchAlgorithm: 'v3' }),
			],
		},
	},
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
	},
	image: {
		responsiveStyles: true,
		layout: 'constrained',
	},
	env: {
		schema: {
			PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
				access: 'public',
				context: 'client',
				optional: true,
			}),
		},
	},

	fonts: [
		{
			name: 'Wotfard',
			cssVariable: '--font-wotfard',
			fallbacks: ['sans-serif'],
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/wotfard.woff2'],
					},
				],
			},
		},
		{
			name: 'Sriracha',
			cssVariable: '--font-sriracha',
			fallbacks: ['cursive'],
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/sriracha.woff2'],
					},
				],
			},
		},
		// {
		// 	name: 'Cartograph CF',
		// 	cssVariable: '--font-mono',
		// 	fallbacks: ['monospace'],
		// 	provider: fontProviders.local(),
		// 	options: {
		// 		variants: [
		// 			{
		// 				src: ['./src/assets/fonts/cartograph-cf.woff2'],
		// 			},
		// 		],
		// 	},
		// },
		// {
		// 	name: 'Geist Mono',
		// 	cssVariable: '--font-mono',
		// 	fallbacks: ['monospace'],
		// 	provider: fontProviders.bunny(),
		// },
		{
			name: 'Geist Mono Nerd Font',
			cssVariable: '--font-mono',
			fallbacks: ['monospace'],
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						weight: 300,
						style: 'normal',
						src: ['./src/assets/fonts/GeistMonoNerdFont-Light.woff2'],
					},
					{
						weight: 400,
						style: 'normal',
						src: ['./src/assets/fonts/GeistMonoNerdFont-Regular.woff2'],
					},
					{
						weight: 500,
						style: 'normal',
						src: ['./src/assets/fonts/GeistMonoNerdFont-Medium.woff2'],
					},
					{
						weight: 700,
						style: 'normal',
						src: ['./src/assets/fonts/GeistMonoNerdFont-Bold.woff2'],
					},
				],
			},
		},
		{
			name: 'Cascadia Code',
			cssVariable: '--font-cascadia-code',
			fallbacks: ['monospace'],
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/cascadia-code.woff2'],
					},
				],
			},
		},
	],
});
