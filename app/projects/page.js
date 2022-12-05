/* eslint-disable @next/next/no-img-element */
export default function App() {
	return (
		<div className='bg-slate-200 min-h-full'>
			<div className='pt-0'>
				<h1
					className='text-4xl text-center font-bold text-slate-800'
				>My Projects</h1>
				<div className='pt-10 grid grid-cols-1 gap-4 sm:grid-cols-3'>
					{/* card */}
					<div>
						<a href='https://canaris.is-a.dev' target='_blank' rel='noreferrer'>
							<div className='bg-zinc-300 duration-300 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl'>
								<img alt='' className='rounded-lg' src='/blog.png' />
								<h2 className='text-2xl font-bold text-slate-800 mt-3'>
								My Personal Site
								</h2>
								<p className='text-slate-800'>
								The current site you&apos;re looking at. Built with Next.js and Tailwind CSS, and pretty bland at the moment
								</p>
							</div>
						</a>
					</div>

					<div>
						<a href='https://github.com/DET171/torrent-client' target='_blank' rel='noreferrer'>
							<div className='bg-zinc-300 duration-300 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl'>
								<img className='rounded-lg' src='/torrent.png' />
								<h2 className='text-2xl font-bold text-slate-800 mt-3'>
									Torrent Client
								</h2>
								<p className='text-slate-800'>
									A torrent client written with WebTorrent and Electron. Doesn&apos;t really look that good, but again, I kinda suck at design.
								</p>
							</div>
						</a>
					</div>

					<div>
						<a href='https://github.com/EC3-Gang/open-house-wordle' target='_blank' rel='noreferrer'>
							<div className='bg-zinc-300 duration-300 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl'>
								<img className='rounded-lg' src='/worldle.png' />
								<h2 className='text-2xl font-bold text-slate-800 mt-3'>
								GeoGuessr
								</h2>
								<p className='text-slate-800'>
								A GeoGuessr-like game my school got me to make but didn&apos;t end up using. Still pretty pissed about it
								</p>
							</div>
						</a>
					</div>

				</div>
			</div>
		</div>
	);
}