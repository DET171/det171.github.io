---
title: Automating ReVanced Patching Because I'm Lazy
published: 2025-06-06
description: 'Image unrelated'
image: '../../assets/images/feixiao.jpg'
tags: ['ReVanced', 'Automation']
category: 'Programming'
draft: true
lang: en
---

_Ignore the Feixiao pic, it just looks nice._

I'll be frank, I am quite the lazy person. Min-maxxing life is kinda just my thing (money included), so naturally, I use something called [ReVanced](https://github.com/revanced/revanced-manager). For the uninformed, it is essentially a tool that allows you to patch applications, such as YouTube Music, to remove ads, add features, etc. 

So, basically a successor to the now-defunct YouTube Vanced. There was a minor pain point, however, being that Spotify liked pushing updates every week or so and breaking the patches. I'd then have to spend 5-10 minutes redownloading the app from the Play Store, unsplitting it, and then patching it. Now, I'd agree that 5-10 minutes is rather insignificant, but, me being me, was bored (being allergic to holiday homework didn't help), and here we are.

Anyways, lets get started.

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
