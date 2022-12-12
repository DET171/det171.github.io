'use client';

import AOS from 'aos';
import { useEffect } from 'react';
import aboutData from './about.json';


const conjunction = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
const books = conjunction.format(aboutData.books);
const tv = conjunction.format(aboutData.tv);

export default function Page() {
	useEffect(() => {
		AOS.init({
			duration: 1000,
		});
	}, []);

	return (
		<div className='bg-slate-200'>
			<div className='flex flex-col items-center justify-center min-h-screen pt-8 pb-10'>
				<main className='flex flex-col items-center justify-center w-full flex-1 text-center'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						alt='logo'
						className='inline object-cover w-60 h-60 mr-2 rounded-full'
						src='https://avatars.githubusercontent.com/u/68373699?v=4'
					/>
					<h1 className={'text-6xl font-display italic py-10'}>Hi, I am Canaris,</h1>
					<p className={'text-2xl font-display'}>
						a <span className='description'></span>
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
							I grind War Thunder on a daily basis (am currently grinding for the YAH-64 and the SL to buy it), and play Ace Combat 7: Skies Unknown and World of Tanks Blitz on and off.

							On rare occasions I decide to play MLBB and Minecraft.
							<br /><br />
							I also like reading books, my favourites being Percy Jackson and Heroes of Olympus series. Currently reading {books} and watching {tv}.
						</p>
					</div>
					<div
						data-aos='fade-left'
						className='p-10 rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-2xl w-full'
					>
						<h4 className='text-3xl font-bold italic mb-4 text-center'>Accounts</h4>
						<div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
							<p><a className='underline text-blue-600 hover:text-blue-800 visited:text-indigo-600' href='https://github.com/DET171'>GitHub <i className='fa-brands fa-github' /></a></p>
						</div>

					</div>
				</main>
			</div>
		</div>
	);
}