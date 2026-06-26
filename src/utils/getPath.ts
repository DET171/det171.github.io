import { BLOG_PATH } from '@/content.config';
import { slugifyStr } from './slugify';

/**
 * Get full path of a blog post, derived from its file path on disk.
 * For `index.{md,mdx}` files the directory itself is the post, so the
 * `index` filename is stripped and only the directory segments are used.
 *
 * @param _id - unused, kept for backwards-compatible call sites
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in the return value
 * @returns blog post path, e.g. "/posts/hello-world"
 */
export function getPath(
	_id: string,
	filePath: string | undefined,
	includeBase = true,
) {
	const basePath = includeBase ? '/posts' : '';

	const pathSegments = filePath
		?.replace(BLOG_PATH, '')
		.replace(/\/index\.(md|mdx)$/, '') // strip /index.mdx for index files
		.replace(/\.(md|mdx)$/, '') // strip .md/.mdx extension
		.split('/')
		.filter(p => p !== '')
		.filter(p => !p.startsWith('_'))
		.map(segment => slugifyStr(segment));

	if (!pathSegments || pathSegments.length < 1) {
		return basePath || '/';
	}

	return [basePath, ...pathSegments].join('/');
}
