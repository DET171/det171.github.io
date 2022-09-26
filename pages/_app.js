import '../styles/globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { GoogleAnalytics } from 'nextjs-google-analytics';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<GoogleAnalytics trackPageViews gaMeasurementId='G-4GPB1Z1HL6' />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
