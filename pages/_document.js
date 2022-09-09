import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html className='dark'>
			<Head>
				<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}