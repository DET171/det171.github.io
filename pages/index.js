import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className='bg-slate-200'>
			<Head>
				<title>Home</title>
			</Head>
			<div className='flex flex-col items-center justify-center min-h-screen py-2'>
				<main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						alt='logo'
						className='inline object-cover w-60 h-60 mr-2 rounded-full'
						src='https://avatars.githubusercontent.com/u/68373699?v=4'
					/>
					<h1 className='text-6xl font-bold italic py-10'>Canaris</h1>
					<p className='mt-3'>
						I see you have found my personal space on the web. This page is currently WIP, maybe come back sometime later?
					</p>
				</main>
			</div>

		</div>
	);
}
