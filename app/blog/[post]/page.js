import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import MDXRemote from './MDXRemoteWrapper.js';
import prism from '@mapbox/rehype-prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Giscus from './GiscusWrapper.js';
import TOC from 'remark-toc';
import 'prism-themes/themes/prism-one-dark.css';


export default async function Page({ params }) {
	const source = fs.readFileSync(
		path.join(process.cwd(), 'posts', `${params.post}.mdx`),
		'utf-8',
	);

	const content = await serialize(source, {
		parseFrontmatter: true,
		mdxOptions: {
			rehypePlugins: [
				prism,
				rehypeKatex,
			],
			remarkPlugins: [
				TOC,
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