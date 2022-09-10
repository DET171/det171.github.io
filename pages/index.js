import Head from 'next/head';
import { getPosts } from '../scripts/getPosts';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import dayjs from 'dayjs';

export default function Home({ posts }) {
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
							I am a High School Student. I like programming in my free time (which unfortunately I don&apos;t have much of). I mostly use JavaScript/TypeScript for backend and frontend development. I&apos;m currently learning Rust and also interested in game development although I haven&apos;t had time to learn it yet.
						</p>
					</div>

					<div
						data-aos='fade-left'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Other things I do</h4>
						<p className='my-5 text-left'>
							As with most people, I like playing games during my (occasional) free time. I mostly sell my soul to Gaijin and grind War Thunder. A few other ones I occasionally touch are Phantom Forces and Minecraft. <br />
							And yes, I main Germany and USA.
						</p>
					</div>

					{/* list of posts */}
					<div
						data-aos='fade-right'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Posts</h4>
						{posts
							.sort((a, b) => {
								return (dayjs(a).isAfter(dayjs(b)) ? 1 : -1);
							})
							.map((post) => (
								<div key={post.slug} className='my-5 text-center'>
									<a
										href={`/posts/${post.slug}`}
										className='text-2xl font-bold italic hover:underline'
									>
										{post.data.title}
									</a>
									<p className='text-sm'>{post.data.date}</p>
									<p className='text-base'>{post.data.description}</p>
								</div>
							))}
					</div>
				</main>
			</div>
			<footer
				className='flex flex-col items-center justify-center w-full flex-1 text-center py-10'
				data-aos='fade-down'
			>
				<hr
					className='border-slate-300 border-2 w-3/5 mb-5'
				/>
				<div className='grid grid-cols-2 w-3/5'>
					<a href='https://github.com/DET171' target={'_blank'} rel='noreferrer'><i className='fa-brands fa-github'></i></a>
					<span><i className='fa-brands fa-discord'></i>&nbsp;&nbsp; 𝓐𝓭𝓶𝓲𝓻𝓪𝓵 𝓒𝓪𝓷𝓪𝓻𝓲𝓼#0340</span>
				</div>
			</footer>
		</div>
	);
}

export const getStaticProps = () => {
	const posts = getPosts();

	return {
		props: {
			posts,
		},
	};
};