import { Source_Sans_Pro, Fredoka_One } from '@next/font/google';
import NavBar from '../components/Nav.js';
import Script from 'next/script';
import 'aos/dist/aos.css';
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
				<Script async src='https://www.googletagmanager.com/gtag/js?id=G-4GPB1Z1HL6'></Script>
				<Script id='google-analytics' strategy='afterInteractive'>
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-4GPB1Z1HL6', {
							page_path: window.location.pathname,
						});
					`}
				</Script>
				<meta name='google-site-verification' content='RyK2veBYbey_5eYN8N1bZKZUeRgbGitCJrdKOrXTWl8' />
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='description' content='Canaris' />
				<meta name='author' content='Canaris' />
				<meta name='theme-color' content='#000000' />
				<link rel='icon' href='/favicon.ico' />
			</head>
			<body className='bg-slate-200'>
				<NavBar />
				<div className='sm:px-20 px-5 pt-28 pb-5'>
					{children}
				</div>
			</body>
		</html>
	);
}