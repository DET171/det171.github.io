import { Source_Sans_Pro, Fredoka_One } from '@next/font/google';
import NavBar from '../components/Nav.js';
import 'aos/dist/aos.css';
import 'highlight.js/styles/atom-one-dark.css';
import '../styles/globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SSP = Source_Sans_Pro({
	weight: '400',
	subsets: ['latin'],
});

export default function RootLayout({ children }) {
	return (
		<html lang='en' className={`${SSP.className}`}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='description' content='Canaris' />
				<meta name='author' content='Canaris' />
				<meta name='theme-color' content='#000000' />
				<link rel='icon' href='/favicon.ico' />
			</head>
			<body className='bg-slate-200'>
				<NavBar />
				<div className='pt-28'>
					{children}
				</div>
			</body>
		</html>
	);
}