import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';
import shiki from 'shiki';
const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});


export default async function App() {
	const statuses = [];
	const files = await fs.readdir(`${process.cwd()}/app/daily-shitposts/posts`);
	for (const file of files) {
		const content = await fs.readFile(`${process.cwd()}/app/daily-shitposts/posts/${file}`, 'utf-8');
		statuses.push({
			date: file.split('.')[0],
			content: md.render(content),
		});
	}


	return (
		<>
			<h1 className='text-4xl font-bold text-center'>Daily Statuses/Shitposts</h1>
			<div className='flex flex-col items-center justify-center w-full flex-1 text-center'>
				{statuses
					.sort((a, b) => {
						const dateA = new Date(a.date);
						const dateB = new Date(b.date);
						return dateB - dateA;
					})
					.map((status) => (
						<div key={status.date} className='duration-300 hover:scale-110 p-10 items-center max-w-4xl mt-10 sm:w-full bg-zinc-300 shadow-2xl w-full hover:shadow-[0_45px_80px_-20px_rgba(0,0,0,0.3)]'>
							<h4 className='text-3xl font-bold italic mb-4 text-center'>{status.date}</h4>
							<div className='my-5 text-left prose w-full max-w-none' dangerouslySetInnerHTML={{
								__html: status.content,
							}}></div>
						</div>
					))}
			</div>
		</>
	);
}