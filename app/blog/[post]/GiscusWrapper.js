'use client';

import Giscus from '@giscus/react';

export default function GiscusWrapper() {
	return (
		<Giscus
			repo='DET171/giscus'
			repoId='R_kgDOH930rg'
			category='Announcements'
			categoryId='DIC_kwDOH930rs4CRVxe'
			mapping='pathname'
			strict='0'
			reactionsEnabled='1'
			emitMetadata='0'
			inputPosition='top'
			theme='light'
			lang='en'
			loading='lazy'
		></Giscus>
	);
}