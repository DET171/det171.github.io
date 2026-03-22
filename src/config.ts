export const SITE = {
	website: 'https://yourblog.com/',
	author: 'Your Name',
	profile: 'https://github.com/yourusername',
	desc: 'A space where curiosity turns into code.',
	title: 'Your Blog',
	ogImage: 'og-image.webp', // located in the public folder
	lightAndDarkMode: true,
	postPerIndex: 6,
	postPerPage: 8,
	scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
	showArchives: true,
	showGalleries: true,
	showBackButton: true, // show back button in post detail
	editPost: {
		enabled: true,
		text: 'Edit this post',
		url: 'https://github.com/yourusername/yourrepo/edit/main/',
	},
	dynamicOgImage: true,
	dir: 'ltr', // "rtl" | "auto"
	lang: 'en', // html lang code. Set this empty and default will be "en"
	timezone: 'America/New_York', // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
	introAudio: {
		enabled: true, // show/hide the audio player in the hero
		src: '/audio/intro-web.mp3', // path to file (relative to /public)
		label: 'INTRO.MP3', // display label in the player
		duration: 30, // duration in seconds (for the fixed progress bar)
	},
} as const;
