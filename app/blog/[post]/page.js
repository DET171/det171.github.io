import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import * as shiki from 'shiki';
import MDXRemote from './MDXRemoteWrapper.js';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Giscus from './GiscusWrapper.js';


export default async function Page({ params }) {
	const source = fs.readFileSync(
		path.join(process.cwd(), 'posts', `${params.post}.mdx`),
		'utf-8',
	);

	const content = await serialize(source, {
		parseFrontmatter: true,
		mdxOptions: {
			rehypePlugins: [
				rehypeHighlight,
				rehypeKatex,
			],
			remarkPlugins: [
				remarkGfm,
				remarkMath,
			],
		},
	});

	return (
		<div>
			<MDXRemote {...content} />

			<Giscus />
		</div>
	);
}

export async function generateStaticParams() {
	const posts = fs.readdirSync(path.join(process.cwd(), 'posts'));

	return posts.map((post) => ({
		post: post.replace('.mdx', ''),
	}));
}