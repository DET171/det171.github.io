---
title: Automating ReVanced Patching Because I'm Lazy
published: 2025-06-06
description: 'Image unrelated'
image: 'feixiao.jpg'
tags: ['ReVanced', 'Automation']
category: 'Programming'
draft: false
lang: en
---

_Ignore the Feixiao pic, it just looks nice._

:::note
Update: Honestly, just download your music. Not worth the pain.

:::

For those who use [ReVanced](https://github.com/revanced/revanced-manager), perhaps the most major pain point about it is the need to manually patch apps like YouTube Music or Spotify every time they update. This can be quite the repetitive process and it does eventually get annoying, especially if you use these apps frequently (looking at you Spotify). Now, you may argue that 5-10 minutes may be rather insignificant, but it is somewhat of a running joke that programmers like spending 10 hours automating a task that takes 10 minutes, so, why not?

## Prerequisites

Since we're going to be tinkering with Android stuff, we'll need some tools from the Android SDK:
- `build-tools` (version shouldn't matter too much, but I'm on 36.0.0)
- `platform-tools`
- `cmdline-tools`

You can check if they're installed with:
```bash
sdkmanager --list_installed
```

Lest you don't, you can install them with:
```bash
sdkmanager "build-tools;36.0.0" "platform-tools" "cmdline-tools;latest"
```

:::note
If you're on Windows and using Git Bash, you might need to run `sdkmanager.bat` instead of `sdkmanager`.
:::

We're also going to need the following:
- Node.js >= 22 (optimally just use LTS)
- Corepack (should come with the above)

Run `corepack enable`, if you haven't already, to enable it.

## Setting Up the Project

Create a new directory for the project and navigate into it:
```bash
mkdir automating-revanced && cd automating-revanced
```

Now, initialize a new Node.js project:
```bash
pnpm init --init-type module

# Pin the package manager
corepack use pnpm@latest
```

Set your `main` in `package.json` to `src/index.ts`.

Setup a `tsconfig.json` file for TypeScript:

```bash
pnpm --package=typescript dlx tsc --init
mkdir src
```

After this finishes, change the `target`, `module`, and `moduleResolution` options in the `tsconfig.json` file to (make sure to remove conflicting options if any):

```json
{
	"compilerOptions": {
		// ... other options ...
		"target": "esnext",
		"module": "nodenext",
		"moduleResolution": "nodenext"
		// ... other options ...
	}
}
```

Let's install the some dependencies we need:

```bash
pnpm add -D @biomejs/biome @swc-node/register @types/jsdom @types/node @types/yargs
pnpm add consola jsdom ky yargs
```

Setup biome:
```bash
pnpm biome init
```
This will create a `biome.json` file. You can configure it to your liking, but here's mine:
```json collapse={1-39}
{
	"$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
	"vcs": {
		"enabled": false,
		"clientKind": "git",
		"useIgnoreFile": false
	},
	"files": {
		"ignoreUnknown": false,
		"ignore": []
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"organizeImports": {
		"enabled": true
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"style": {
				"noNonNullAssertion": "warn",
				"noInferrableTypes": "off"
			},
			"suspicious": {
				"noExplicitAny": "warn"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "single",
			"semicolons": "always",
			"trailingCommas": "all"
		}
	}
}
```


Now, setup the `scripts` under `package.json`:

```json
{
	// ...
	"scripts": {
		"start": "node --import @swc-node/register/esm-register .",
		"lint": "biome check --fix .",
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	// ...
}
```

Now, create a keystore file for signing the APKs later on:
```bash
mkdir -p keystore
keytool -genkey -v -keystore keystore/rv.keystore -alias revanced -keyalg RSA -keysize 2048 -validity 10000
```
This will prompt you for some information, which you can fill out as you like. Just remember the password you set, as you'll need it later.

Your project structure should now look something like this (excluding the `node_modules`):
```bash
.
├── biome.json
├── keystore
│   └── rv.keystore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json
```

All that's left is to write the code.

## Implementing the CLI

Implementing the CLI is pretty trivial, especially with `yargs`.

Create a new file `src/index.ts` and add the following code:

```ts
import { exit } from 'node:process';
import console from 'consola';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = await yargs(hideBin(process.argv))
	.option('app', {
		alias: 'a',
		type: 'string',
		description: 'The name of the app to patch with ReVanced',
		demandOption: true,
	})
	.option('app-ver', {
		alias: 'av',
		type: 'string',
		description: 'The version of the app to patch',
		demandOption: false,
	})
	.parse();

console.box('ReVanced - Patching App:', args.app);
```

Running `pnpm start -h` should now give you this:
```bash
Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -a, --app            The name of the app to patch with ReVanced
                                                             [string] [required]
      --app-ver, --av  The version of the app to patch                  [string]

Missing required argument: app
```

## Downloading ReVanced and Co.
ReVanced has a CLI for patching files in addition to the the patches file itself, so we're gonna need those. We're also going to need APKEditor for merging the split APKs (tough).

Before that, though, let's define some types for GitHub Releases since we'll be using the GitHub API to download the files:
```ts title=src/types.ts
// create a new file src/types.ts
export type GitHubUser = {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
};

export type GitHubAsset = {
	url: string;
	id: number;
	node_id: string;
	name: string;
	label: string;
	uploader: GitHubUser;
	content_type: string;
	state: string;
	size: number;
	digest: string | null;
	download_count: number;
	created_at: string;
	updated_at: string;
	browser_download_url: string;
};

export type GitHubRelease = {
	url: string;
	assets_url: string;
	upload_url: string;
	html_url: string;
	id: number;
	author: GitHubUser;
	node_id: string;
	tag_name: string;
	target_commitish: string;
	name: string;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	assets: GitHubAsset[];
	tarball_url: string;
	zipball_url: string;
	body: string;
};
```
This isn't really necessary, but I'm just a pedant for types.

Create `src/download-tools.ts` for the part that actually downloads the required tools:
```ts title=src/download-tools.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';
import console from 'consola';
import ky from 'ky';
import type { GitHubRelease } from './types.js';

const PATCHES_URL =
	'https://api.github.com/repos/ReVanced/revanced-patches/releases/latest';
const CLI_URL =
	'https://api.github.com/repos/ReVanced/revanced-cli/releases/latest';
const APKEDITOR_URL =
	'https://api.github.com/repos/REAndroid/APKEditor/releases/latest';

const tools = {
	patches: {
		url: PATCHES_URL,
		fileName: 'patches',
		extension: '.rvp',
	},
	cli: {
		url: CLI_URL,
		fileName: 'cli',
		extension: '.jar',
	},
	apkEditor: {
		url: APKEDITOR_URL,
		fileName: 'apkeditor',
		extension: '.jar',
	},
};
```

Now a function to download the files:
```ts title=src/download-tools.ts
const downloadTool = async (
	tool: keyof typeof tools,
	saveDir: string,
): Promise<string> => {
	try {
		const toolInfo = tools[tool];
		const res = await ky(toolInfo.url).json<GitHubRelease>();

		const assets = res.assets.filter((asset) =>
			asset.name.endsWith(toolInfo.extension),
		);

		const version = res.tag_name.toLowerCase().replace('v', '');
		const toolUrl = assets.length > 0 ? assets[0].browser_download_url : '';

		if (!toolUrl) {
			throw new Error(`Failed to fetch the latest ${tool} from GitHub.`);
		}
		const existingFiles = await fs.readdir(saveDir);
		const existingFile = existingFiles.find((file) =>
			file.match(
				new RegExp(
					`${toolInfo.fileName}-\\d+\\.\\d+\\.\\d+${toolInfo.extension}$`,
				),
			),
		);

		const existingVer = existingFile
			? existingFile.split('-')[1].replace(toolInfo.extension, '')
			: '';

		const outFile = path.join(
			saveDir,
			`${toolInfo.fileName}-${version}${toolInfo.extension}`,
		);

		if (existingFile && existingVer === version) {
			console.info(`Using existing ${tool}: ${outFile}`);
			return outFile;
		}
		// delete existing file if it exists
		if (existingFile) {
			await fs.unlink(path.join(saveDir, existingFile));
		}

		const toolBlob = await ky(toolUrl).blob();
		const toolBuffer = Buffer.from(await toolBlob.arrayBuffer());
		await fs.writeFile(outFile, toolBuffer);
		console.info(`${tool} downloaded successfully to ${saveDir}`);

		return outFile;
	} catch (error) {
		console.error(`Error fetching ${tool} from GitHub:`, error);
		throw error;
	}
};
```

`downloadTool` essentially takes the key of a tool (i.e. `patches`, `cli`, or `apkEditor`), the directory to save the file to, and returns the path to the downloaded file. It checks if a file with the same version already exists, and if so, it uses that instead of downloading a new one.

Now, we can create a function to download all the tools:
```ts title=src/download-tools.ts
export async function downloadTools(
	saveDir_: string = './tools',
): Promise<{ patches: string; cli: string; apkEditor: string }> {
	try {
		const toolPaths = {} as Record<string, string>;
		const saveDir = path.resolve(import.meta.dirname, '..', saveDir_);

		// Ensure the save directory exists
		await fs.mkdir(saveDir, { recursive: true });

		for (const tool in tools) {
			toolPaths[tool] = await downloadTool(<keyof typeof tools>tool, saveDir);
		}

		console.info(`ReVanced tools downloaded successfully to ${saveDir}`);

		return toolPaths as {
			[key in keyof typeof tools]: string;
		};
	} catch (error) {
		console.error('Error fetching ReVanced tools:', error);
		throw error;
	}
}
```
This function will download all the tools and returns the paths of them once finished.

Edit your `src/index.ts` to import and call this function:
```diff lang='ts' title=src/index.ts
import { exit } from 'node:process';
import console from 'consola';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
+import { downloadTools } from './download-tools.js';

const args = await yargs(hideBin(process.argv))
	.option('app', {
		alias: 'a',
		type: 'string',
		description: 'The name of the app to patch with ReVanced',
		demandOption: true,
	})
	.option('app-ver', {
		alias: 'av',
		type: 'string',
		description: 'The version of the app to patch',
		demandOption: false,
	})
	.parse();

console.box('ReVanced - Patching App:', args.app);

+try {
+	const { patches, cli, apkEditor } = await downloadTools();
+
+} catch (error) {
+	console.error('Failed to download ReVanced patches or CLI:', error);
+	process.exit(1);
+}
```

## Getting the APKs
Obviously, without the APKs there'd be nothing to patch, so we'd need to do that as well. We're going to (attempt to) impersonate a browser and crawl APKPure to get them, so this isn't exactly guaranteed to work in the future.

Before that however, let's write some utils:
```ts title=src/utils.ts
import { spawn } from 'node:child_process';

type Options = Parameters<typeof spawn>[2];

export const runCommand = async (
	command: string,
	args: string[],
	options: Options = {},
): Promise<void> => {
	const child = spawn(command, args, {
		stdio: 'inherit',
		shell: true,
		cwd: process.cwd(),
		...options,
	});

	// console.log(child.spawnargs);

	return new Promise((resolve, reject) => {
		child.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command failed with exit code ${code}`));
			}
		});
	});
};
```
This function is basically a wrapper around `child_process.spawn` that allows us to run commands in the shell and inherit the stdio, and returns a promise that resolves when the command finishes executing.

Now, back to downloading the APKs.

Create a `src/download-apks.ts` and import the necessary modules:
```ts title=src/download-apks.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';
import console from 'consola';
import { JSDOM } from 'jsdom';
import ky from 'ky';
import { runCommand } from './utils.js';
```

Create a `ky` client with headers to impersonate a browser:
```ts title=src/download-apks.ts
const client = ky.create({
	headers: {
		'sec-ch-ua': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': '"Windows"',
		'upgrade-insecure-requests': '1',
	},
	retry: {
		limit: 3,
	},
});
```
You can head over to your browser's Network tab and copy the headers from a request to get the headers you need.

The function to scrape and get the download links for the APKs:
```ts title=src/download-apks.ts
const getDownloadUrl = async (
	appId: string,
	version?: string,
): Promise<string> => {
	const pageUrl = `https://apkpure.com/en/${appId}/download/${version ?? ''}`;

	console.info(`Fetching download page: ${pageUrl}`);

	const html = await client.get(pageUrl).text();
	const dom = new JSDOM(html).window.document;

	const versionsEl = dom.querySelector('#version-list div.show-more-content');

	if (!versionsEl) {
		throw new Error(`Versions not found for app ID: ${appId}`);
	}

	const links = [...versionsEl.querySelectorAll('a[class*=download]')]
		.map((el) => el.getAttribute('href'))
		.filter((l) => l !== null);

	// sort the links so that the links that don't return xapk are at the front
	// we want a single bundled APK as much as possible
	const sortedLinks = links.sort((a, b) => {
		if (a.includes('/XAPK/')) return 1; // xapk links go to the end
		if (b.includes('/XAPK/')) return -1; // xapk links go to the end
		return 0; // keep the order for non-xapk links
	});

	const armv8aLink = sortedLinks.find((link) => link.includes('v8a'));

	const dlLink = armv8aLink || sortedLinks[0];

	if (!dlLink) {
		throw new Error(`Download link not found for app ID: ${appId}`);
	}

	return dlLink;
};
```
This function takes the app ID and an optional version, fetches the download page, and parses the HTML element containing the download links for different variants, prioritising regular `.apk` files over `.xapk` or `.apks` files and those which specify `arm64-v8a` architecture.

For the function that actually downloads the APK:
```ts title=src/download-apks.ts
export const downloadApk = async (
	appId: string,
	apkEditor: string,
	appVer?: string,
	saveDir_: string = './unpatched-apks',
): Promise<string> => {
	try {
		const appUrl = await getDownloadUrl(appId, appVer);

		console.info(`Download link found: ${appUrl}`);

		const saveDir = path.resolve(
			import.meta.dirname,
			'..',
			saveDir_,
			`${appId}${appVer ? `-${appVer}` : ''}`,
		);

		const keystore = path.resolve(
			import.meta.dirname,
			'..',
			'keystore/rv.keystore',
		);

		await fs.mkdir(saveDir, { recursive: true });
		await fs.unlink(path.join(saveDir, `${appId}.apk`)).catch(() => {});

		const response = await client.get(appUrl);

		const content_disposition = response.headers.get('content-disposition');
		if (!content_disposition) {
			throw new Error('Content-Disposition header not found');
		}
		const filenameMatch = content_disposition.match(/filename="(.+?)"/);
		if (!filenameMatch) {
			throw new Error('Filename not found in Content-Disposition header');
		}

		const extension = filenameMatch[1].split('.').pop();

		const filename = `${appId}.${extension}`;
		const dlFile = path.join(saveDir, filename);

		const blob = await response.blob();
		const buffer = Buffer.from(await blob.arrayBuffer());
		await fs.writeFile(dlFile, buffer);
		console.info(`XAPK/APK downloaded to: ${dlFile}`);

		const apkFile = path.join(saveDir, `${appId}.apk`);

		if (extension === 'apk') {
			console.info('APK file already exists, no merging needed.');
			await fs.rename(dlFile, apkFile);
			console.info(`APK saved to: ${apkFile}`);
			return apkFile;
		}

		console.info(`APK downloaded and saved to: ${apkFile}`);

		return apkFile;
	} catch (error) {
		console.error(
			`Failed to download APK for ${appId}:`,
			(<Error>error).message,
		);
		throw error;
	}
};
```

We still need to handle split APKs, and APKEditor conveniently has a command for that, so let's implement that as well:
```diff lang='ts' collapse={8-56,97-107} title=src/download-apks.ts
export const downloadApk = async (
	appId: string,
	apkEditor: string,
	appVer?: string,
	saveDir_: string = './unpatched-apks',
): Promise<string> => {
	try {
		const appUrl = await getDownloadUrl(appId, appVer);

		console.info(`Download link found: ${appUrl}`);

		const saveDir = path.resolve(
			import.meta.dirname,
			'..',
			saveDir_,
			`${appId}${appVer ? `-${appVer}` : ''}`,
		);

		const keystore = path.resolve(
			import.meta.dirname,
			'..',
			'keystore/rv.keystore',
		);

		await fs.mkdir(saveDir, { recursive: true });
		await fs.unlink(path.join(saveDir, `${appId}.apk`)).catch(() => {});

		const response = await client.get(appUrl);

		const content_disposition = response.headers.get('content-disposition');
		if (!content_disposition) {
			throw new Error('Content-Disposition header not found');
		}
		const filenameMatch = content_disposition.match(/filename="(.+?)"/);
		if (!filenameMatch) {
			throw new Error('Filename not found in Content-Disposition header');
		}

		const extension = filenameMatch[1].split('.').pop();

		const filename = `${appId}.${extension}`;
		const dlFile = path.join(saveDir, filename);

		const blob = await response.blob();
		const buffer = Buffer.from(await blob.arrayBuffer());
		await fs.writeFile(dlFile, buffer);
		console.info(`XAPK/APK downloaded to: ${dlFile}`);

		const apkFile = path.join(saveDir, `${appId}.apk`);

		if (extension === 'apk') {
			console.info('APK file already exists, no merging needed.');
			await fs.rename(dlFile, apkFile);
			console.info(`APK saved to: ${apkFile}`);
			return apkFile;
		}

+		console.info('Merging XAPK to APK...\n');
+
+		// Run the APK Editor CLI to merge the XAPK into an APK, and clean metadata & signature blocks
+		await runCommand('java', [
+			'-jar',
+			apkEditor,
+			'm',
+			'-i',
+			dlFile,
+			'-o',
+			apkFile,
+			'-clean-meta',
+		]);
+
+		// align the APK
+		console.info('Aligning APK...\n');
+		await runCommand('zipalign', [
+			'-p',
+			'-f',
+			'4',
+			apkFile,
+			apkFile.replace('.apk', '-aligned.apk'),
+		]);
+
+		// remove the original APK
+		await fs.unlink(apkFile);
+		// rename the aligned APK
+		await fs.rename(apkFile.replace('.apk', '-aligned.apk'), apkFile);
+
+		// sign the APK
+		console.info('Signing APK...\n');
+		await runCommand('apksigner', [
+			'sign',
+			'--ks',
+			keystore,
+			'--ks-pass',
+			'pass:revanced',
+			apkFile,
+		]);
+
+		console.log('');

		console.info(`APK downloaded and saved to: ${apkFile}`);

		return apkFile;
	} catch (error) {
		console.error(
			`Failed to download APK for ${appId}:`,
			(<Error>error).message,
		);
		throw error;
	}
};
```

Npw just import this function in `src/index.ts` and call it:
```diff lang='ts' title=src/index.ts
import { exit } from 'node:process';
import console from 'consola';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
+import { downloadApk } from './download-apk.js';
import { downloadTools } from './download-tools.js';

const args = await yargs(hideBin(process.argv))
	.option('app', {
		alias: 'a',
		type: 'string',
		description: 'The name of the app to patch with ReVanced',
		demandOption: true,
	})
	.option('app-ver', {
		alias: 'av',
		type: 'string',
		description: 'The version of the app to patch',
		demandOption: false,
	})
	.parse();

console.box('ReVanced - Patching App:', args.app);

// Download the latest ReVanced patches and CLI
try {
	const { patches, cli, apkEditor } = await downloadTools();

+	const apkFile = await downloadApk(args.app, apkEditor, args.appVer);
} catch (error) {
	console.error('Failed to download ReVanced patches or CLI:', error);
	process.exit(1);
}
```

## Patching
Patching should be relatively trivial given the above:
```ts title=src/patch-apk.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';
import { runCommand } from './utils.js';

export const patchApk = async (
	apkFile: string,
	patchFiles: string,
	revancedCli: string,
	outDir_: string = './out',
): Promise<string> => {
	try {
		const outDir = path.resolve(import.meta.dirname, '..', outDir_);
		const outFilePath = path.join(outDir, path.basename(apkFile));
		const tempDir = path.join(import.meta.dirname, '..', '.revanced');

		console.log(apkFile, patchFiles, revancedCli);

		await fs.mkdir(outDir, { recursive: true });

		await runCommand('java', [
			'-jar',
			revancedCli,
			'patch',
			'-p',
			patchFiles,
			'-t',
			tempDir,
			'-o',
			outFilePath,
			apkFile,
		]);

		return outFilePath;
	} catch (error) {
		console.error('Failed to patch APK:', error);
		exit(1);
	}
};
```

Just import this in `src/index.ts` and call it:
```diff lang='ts' title=src/index.ts
import { exit } from 'node:process';
import console from 'consola';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { downloadApk } from './download-apk.js';
import { downloadTools } from './download-tools.js';
+import { patchApk } from './patch-apk.js';

const args = await yargs(hideBin(process.argv))
	.option('app', {
		alias: 'a',
		type: 'string',
		description: 'The name of the app to patch with ReVanced',
		demandOption: true,
	})
	.option('app-ver', {
		alias: 'av',
		type: 'string',
		description: 'The version of the app to patch',
		demandOption: false,
	})
	.parse();

console.box('ReVanced - Patching App:', args.app);

// Download the latest ReVanced patches and CLI
try {
	const { patches, cli, apkEditor } = await downloadTools();

	const apkFile = await downloadApk(args.app, apkEditor, args.appVer);
+	const patchedApk = await patchApk(apkFile, patches, cli);
+	console.success('Patching completed successfully!');
} catch (error) {
	console.error('Failed to download ReVanced patches or CLI:', error);
	process.exit(1);
}
```

Now, you can run the script with:
```bash
pnpm start -a com.google.android.apps.youtube.music --av 8.05.51
```

## Scheduling a Workflow
Since the point of this was kinda to automate the process, we can use a cron job to run this script periodically.

I've chosen to use GitHub Actions for this, but you can use any other CI/CD service that supports cron jobs.

Create a new file `.github/workflows/patch-apps.yaml`:
```yaml
name: Patch Apps (Daily)
on:
  schedule:
    # run daily at 6am gmt +8
    - cron: '0 22 * * *'  # Adjust the time as needed (UTC)
  workflow_dispatch:

jobs:
  patch-apps:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'  # Specify the Node.js version
          check-latest: true
          
      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '24'  # Specify the Java version
          distribution: 'temurin'  # Use the Temurin distribution

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - run: |
              sdkmanager "build-tools;36.0.0"
              echo "$ANDROID_HOME/build-tools/36.0.0" >> "$GITHUB_PATH"

      - run: corepack enable

      - name: Install dependencies
        run: pnpm install

      - name: Patch Spotify
        run: pnpm start -a com.spotify.music

      - name: Patch YouTube Music
        run: pnpm start -a com.google.android.apps.youtube.music --av 8.05.51

      - name: Upload patched apps
        uses: actions/upload-artifact@v4
        with:
          name: patched-apps
          path: out/*.apk
          retention-days: 2
```


This should pretty much be it. You can now push this to your GitHub repository and the workflow will run daily at 6am GMT+8 (which is 10pm UTC).
