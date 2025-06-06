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

Setup a `tsconfig.json` file for TypeScript:

```bash
pnpm --package=typescript dlx tsc --init
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
This will create a `.biome.json` file. You can configure it to your liking, but here's mine:
```json collapse={1-28}
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
