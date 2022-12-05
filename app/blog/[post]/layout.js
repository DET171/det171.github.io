import 'katex/dist/katex.min.css';

export default function Layout({ children }) {
	return (
		<article className='m-auto prose prose-lg max-w-none py-20 prose-stone font-sans leading-9 sm:w-3/5 w-full pt-0'>
			{children}
		</article>
	);
}