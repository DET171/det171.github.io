import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link href='https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap' rel='stylesheet' />
				<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css' integrity='sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn' crossOrigin='anonymous'></link>
				<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}