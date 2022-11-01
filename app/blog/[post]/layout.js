import 'katex/dist/katex.min.css';

export default function Layout({ children }) {
	return (
		<article className='m-auto prose prose-lg max-w-none py-20 px-20 prose-stone font-sans leading-9 w-3/5 pt-0'>
			{children}
		</article>
	);
}