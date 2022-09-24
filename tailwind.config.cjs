const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {},
		fontFamily: {
			'display': ['"Fredoka One"', 'sans-serif'],
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};
