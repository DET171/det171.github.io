---
title: VuePress tips
description: A few tips on VuePress that you might wanna look at
---
# Introduction
I assume that if you're reading this, you have used VuePress or want to use VuePress to make a site. I will be using [VuePress 2](https://v2.vuepress.vuejs.org/) for this post.
## Bundlers: Using Vite for development, Webpack for production
Vite is much faster than Webpack when it comes to bundling packages, as it uses [esbuild](https://esbuild.github.io/) to pre-bundle dependencies, and serves source code over [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). However, Vite cannot bundle code for older browsers (e.g. non ESM code). Webpack, on the other hand, can accomplish that, but is slower in bundling. Even its [HMR](https://webpack.js.org/concepts/hot-module-replacement/) can be quite slow when your project is humongous.<br>
However, the question now is *how do I accomplish it*? In fact, it's quite easy.
Open your `config.js` (or `config.ts`). You should see something like the following:
```js
module.exports = {
  // ...
  title: 'Title',
  description: 'Description',
  head: [
    ['meta', { name: 'theme-color', content: '#7354ff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    // ...
  }
}
```
Put the following just before `module.exports`:
```js
const isProd = process.env.NODE_ENV === 'production'
```
In case you haven't read the VuePress docs, you can set the bundler using the `bundler` option.
Add the following under `module.exports`:
```js
bundler: process.env.DOCS_BUNDLER ?? (isProd ? '@vuepress/webpack' : '@vuepress/vite'),
```
We assume the `scripts` section of your `package.json` looks something like the following:
```json
"scripts": {
  "dev": "vuepress dev src",
  "build": "vuepress build src"
}
```
Change it to the following:
```json
"scripts": {
  "dev": "NODE_ENV=development vuepress dev src",
  "build": "NODE_ENV=production vuepress build src"
}
```
The `NODE_ENV=development` sets the value of `process.env.NODE_ENV`. If you want to specify what bundler you want to use without setting `NODE_ENV`, you just have to add `DOCS_BUNDLER=@vuepress/webpack` or `DOCS_BUNDLER=@vuepress/vite` to the scripts the same way we added `NODE_ENV`.
## Using PrismJS during development and Shiki during production
PrismJS is regex based, so has known fail cases. As mentioned on the VuePress docs, Shiki has higher fidelity than PrismJS, and as an added bonus, accepts VS Code themes (which means it has more themes than PrismJS). <br>
To use PrismJS and Shiki during development and production respectively, go to the `plugins` section under `themeConfig`, and add the following:
```js
[
  '@vuepress/plugin-shiki',
  isProd
    ? {
      theme: 'dracula', // see https://github.com/shikijs/shiki/blob/main/docs/themes.md for themes
    }
  : false,
],
```
Your `config.js` or `config.ts` should now look something like this:
```js
module.exports = {
  bundler: process.env.DOCS_BUNDLER ?? (isProd ? '@vuepress/webpack' : '@vuepress/vite'),
  // ...
  title: 'Title',
  description: 'Description',
  head: [
    ['meta', { name: 'theme-color', content: '#7354ff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    // ...
    plugins: [
      [
      '@vuepress/plugin-shiki',
      isProd
        ? {
            theme: 'dracula',
          }
        : false,
      ],
    ]
  }
}
```
Hope this post helped!
