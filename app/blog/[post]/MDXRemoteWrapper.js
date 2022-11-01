'use client';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';

export default function MDXRemoteWrapper(props) {
	return <MDXRemote {...props} />;
}