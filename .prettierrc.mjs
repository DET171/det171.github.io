/** @type {import("prettier").Config} */
export default {
	plugins: [
		'prettier-plugin-astro',
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
	],
	trailingComma: 'all',
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: true,
	endOfLine: 'lf',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
			},
		},
		{
			files: '*.jsonc',
			options: {
				trailingComma: 'none',
			},
		},
	],
};
