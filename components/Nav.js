import Link from 'next/link';

export default function App() {
	const navLinkStyle = 'text-gray-600 duration-200 hover:bg-gray-400 px-3 py-2 rounded-md text-sm font-medium';

	return (
		<nav className='bg-gray-300 fixed w-full top-0 z-50'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 items-center justify-between'>

					<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
						<div className='sm:ml-6 sm:block'>
							<div className='flex space-x-4'>
								<Link href='/' className={navLinkStyle}>Home</Link>
								<Link href='/projects' className={navLinkStyle}>Projects</Link>
								<Link href='/blog' className={navLinkStyle}>Blog</Link>
								<Link href='/daily-shitposts' className={navLinkStyle}>Statuses</Link>
								<a className={navLinkStyle} href='https://github.com/DET171/' target='_blank' rel='noreferrer'>
									GitHub&nbsp;&nbsp;<i className='fab fa-github' />
								</a>
							</div>
						</div>
					</div>

				</div>
			</div>

		</nav>
	);
}