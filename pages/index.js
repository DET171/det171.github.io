import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	return (
		<div className='bg-slate-100'>
			<Head>
				<title>Home</title>
			</Head>
			<div className='flex flex-col items-center justify-center min-h-screen pt-8 pb-3'>
				<main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						alt='logo'
						className='inline object-cover w-60 h-60 mr-2 rounded-full'
						src='https://avatars.githubusercontent.com/u/68373699?v=4'
					/>
					<h1 className='text-6xl font-bold italic py-10'>Canaris</h1>
					<p className='mt-3'>
						I see you have found my personal space on the web.
					</p>

					<div
						data-aos='fade-up'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>About Me</h4>
						<p className='my-5 text-left'>
							I am a student in High School from Singapore. I like programming in my free time (which unfortunately I don&apos;t have much of). I mostly use JavaScript/TypeScript for backend and frontend development. I&apos;m currently learning Rust and also interested in game development although I haven&apos;t had time to learn it yet.
						</p>
					</div>

					<div
						data-aos='fade-left'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Other things I do</h4>
						<p className='my-5 text-left'>
							As with most people, I like playing games during my (occasional) free time. I mostly sell my soul to Gaijin and grind War Thunder. A few other ones I occasionally touch are Phantom Forces and Mincraft. <br />
							And yes, I main Germany and USA.
						</p>
					</div>
				</main>
			</div>

		</div>
	);
}
