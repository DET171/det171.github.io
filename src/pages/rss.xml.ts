import { siteConfig } from '@/site-config';
import { getAllPosts } from '@/utils';
import rss from '@astrojs/rss';

export const GET = async () => {
	const posts = await getAllPosts();

	return rss({
		description: siteConfig.description,
		items: posts.map((post) => ({
			description: post.data.description,
			link: `posts/${post.slug}`,
			pubDate: post.data.publishDate,
			title: post.data.title,
		})),
		site: import.meta.env.SITE,
		title: siteConfig.title,
	});
};
