import { toString as convertToStr } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = convertToStr(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}
