'use client';

import {
	LiveProvider,
	LiveEditor,
	LiveError,
	LivePreview,
} from 'react-live';

export default function ReactLiveEditor({ code }) {
	return (
		<LiveProvider code={code}>
			<LiveEditor />
			<LiveError />
			<LivePreview />
		</LiveProvider>
	);
}