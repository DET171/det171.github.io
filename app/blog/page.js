import Link from 'next/link';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import path from 'path';
import fs from 'fs';
import '../../styles/globals.scss';

export default function App() {
	const files = fs.readdirSync(path.join(process.cwd(), 'app/blog/[post]/posts'));
	const posts = files.map((post) => {
		const content = fs.readFileSync(path.join(process.cwd(), 'app/blog/[post]/posts', post), 'utf-8');
		const { data } = matter(content);
		data.slug = post.replace('.mdx', '');
		data.readingTime = readingTime(content);
		return data;
	});

	return (
		<div>
			<div className='p-10 pt-0'>
				<h1
					className='text-4xl text-center font-bold text-slate-800'
				>My Posts</h1>
				<div className='flex flex-col items-center justify-center'>
					{posts
						.sort((a, b) => {
							return new Date(b.date) - new Date(a.date);
						})
						.map((post) => {
							return (
								<Link key={post.slug} className='w-3/5' href={
									`/blog/${post.slug}`
								}>
									<div
										key={post.slug}
										className='p-10 duration-300 cursor-pointer rounded-lg items-center max-w-4xl mt-10 w-full bg-slate-300 shadow-lg hover:shadow-2xl'
									>
										<h1 className='text-xl font-bold'>{post.title}</h1>
										<p className='text-sm'>{post.date} <br /> {post.readingTime.text}</p>
										<p>{post.description}</p>
									</div>
								</Link>
							);
						})}
				</div>
			</div>
		</div>
	);
}