import { getPosts } from '../../scripts/getPosts';
import NavBar from '../../components/Nav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function App({ posts }) {
	const router = useRouter();

	return (
		<div className='bg-slate-200'>
			<Head>
				<title>Blog</title>
			</Head>
			<NavBar />
			<div className='p-10'>
				<h1
					className='text-4xl text-center font-bold text-slate-800'
				>My Posts</h1>
				<div className='flex flex-col items-center justify-center min-h-screen pt-3 pb-10'>
					{posts
						.sort((a, b) => {
							return new Date(b.data.date) - new Date(a.data.date);
						})
						.map((post) => {
							return (
								<div
									key={post.slug}
									data-aos='fade-left'
									onClick={() => router.push(`/blog/${post.slug}`)}
									className='p-10 duration-300 cursor-pointer rounded-lg items-center max-w-4xl mt-10 sm:w-full bg-slate-300 shadow-lg hover:shadow-2xl'
								>
									<h1 className='text-xl font-bold'>{post.data.title}</h1>
									<p className='text-sm'>{post.data.date} <br /> {post.time.text}</p>
									<p>{post.data.description}</p>
								</div>
							);
						})}
				</div>
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