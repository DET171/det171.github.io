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
		<div className='bg-slate-200'>
			<Head>
				<title>Home</title>
			</Head>

			<div className='flex flex-col items-center justify-center min-h-screen pt-8 pb-10'>
				<main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						alt='logo'
						className='inline object-cover w-60 h-60 mr-2 rounded-full'
						src='https://avatars.githubusercontent.com/u/68373699?v=4'
					/>
					<h1 className='text-6xl font-display italic py-10'>Hi, I am Canaris</h1>
					<p className='text-2xl font-display'>
						I am a <span class='description'></span>
					</p>

					<div
						data-aos='fade-up'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>About Me</h4>
						<p className='my-5 text-left'>
							I like programing during my free time and I am a self-taught developer. I am currently learning Rust, Dart/Flutter, Kotlin and C++, and trying to improve on web designing.
						</p>
					</div>

					<div
						data-aos='fade-left'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Other things I do</h4>
						<p className='my-5 text-left'>
							As with most people, I like playing games during my (occasional) free time. I mostly play War Thunder, but a few other ones I occasionally touch are Phantom Forces, MLBB and Minecraft. <br />
							I also like reading books, and my favourite author Rick Riordan. My favourite series are Percy Jackson and the Olympians, but I also like the Heroes of Olympus and the Trials of Apollo series. <br />
							And yes, I main Germany and USA.
						</p>
					</div>

					<div
						data-aos='fade-right'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Projects</h4>
						<div className='my-5 text-center'>
							<a
								href='https://github.com/DET171/det171.github.io'
								className='text-2xl font-bold italic hover:underline'
							>
								My Personal Website
							</a>
							<p className='text-base'>The current site you&apos;re looking at</p>
						</div>
					</div>

					{/* list of posts */}
					<div
						data-aos='fade-right'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Posts</h4>
						{posts
							.sort((a, b) => {
								return new Date(b.data.date) - new Date(a.data.date);
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