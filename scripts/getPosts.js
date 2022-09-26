import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export const getPosts = () => {
	const dirFiles = fs.readdirSync(path.join(process.cwd(), 'pages', 'blog'), {
		withFileTypes: true,
	});

	const posts = dirFiles
		.map((file) => {
			if (!file.name.endsWith('.mdx')) return;

			const fileContent = fs.readFileSync(
				path.join(process.cwd(), 'pages', 'blog', file.name),
				'utf-8',
			);
			const { data, content } = matter(fileContent);
			const time = readingTime(content);

			const slug = file.name.replace(/.mdx$/, '');
			return { data, slug, time };
		})
		.filter((post) => post);

	return posts;
};