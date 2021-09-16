---
title: Automating the building and deployment of GitHub Pages
description: How to use GitHub Actions to automate the building and deployment of your GitHub Pages
---
> "The most powerful tool we have as developers is automation."
> — Scott Hanselman


This quote is quite true. Without automation, we would spend a lot of out time on things that would have to be done repetitively, for example, manually building and deploying your GitHub pages every time there is a change. <br>
Luckily, you can easily use GitHub Actions to build and deploy your pages by just pushing your repository to GitHub! You don't even need to do anything except to add a configuration file to your repository. <br>
In this post, I will be creating a workflow and using [peaceiris/actions-gh-pages@v3](https://github.com/peaceiris/actions-gh-pages/tree/v3.8.0) from GitHub Marketplace (it's free).
## Getting your GitHub Access Token
We will need this token as we need to authorize the workflow to push to your repository. Make sure it has permission to write to your repositories (see [this](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) on how to get a token). <br>
Now, head over to the repository where your project is located. Go to **Settings > Secrets** and select **New Repository Secret**. Name it `ACCESS_TOKEN` and put your token inside as the value. Click **Add Secret**. We can now access it by using `${{ secrets.ACCESS_TOKEN }}`.

## Setting up a workflow
Now, create a `.github` folder in your project and a `workflows` folder under it. Then, create a file named `deploy.yml`. Here's the base code:
```yaml
name: Deploy to gh-pages

on:
  push:
    branches:
      - master

jobs:
    # ....
```
Now, create a job:
```yaml
jobs:
  gh-pages-deploy:
    name: Deploying to gh-pages
    runs-on: ubuntu-latest # or macos-latest/windows-latest
    steps:
      # ...
```
Create steps that sets up Node.js and checks out the `master` branch (put the following under `steps`):
```yaml
- name: Setup Node.js for use with actions
  uses: actions/setup-node@v1.1.0
  with:
    version:  16.8 # see https://github.com/actions/setup-node#supported-version-syntax for supported versions
  env:
    ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
- name: Checkout branch
  uses: actions/checkout@v2
  env:
   ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
```
Now, create the steps to install the dependencies and build the app:
```yaml
- name: Clean install dependencies
  run: npm ci # or yarn install --frozen-lockfile for yarn
  # if the above doesn't work, use npm i or yarn
  env:
    ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'

- name: Build app
  run: npm run build
  env:
    ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
```
You can replace `npm run build` with your project's command for building static pages, which is `npm run generate` for Nuxt.js.
Now, the final step for deploying:
```yaml
- name: deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
   github_token: ${{ secrets.ACCESS_TOKEN }}
   publish_dir: ./dist
  env:
   ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
```
You can change `./dist` for `publish_dir` to the directory your built pages are located. If you're not sure, run the build command locally to see where the pages are generated (e.g. for Vue.js and Nuxt.js, the `publish_dir` should be `./dist` as the built pages are located there, but for VuePress, `publish_dir` should be `<docs-dir>/.vuepress/dist`).

<details class="hide-marker">

<summary>

  Show the completed `.github/workflows/deploy.yml` file
</summary>

```yaml
name: Deploy to gh-pages

on:
  push:
    branches:
      - master

jobs:
    gh-pages-deploy:
      name: Deploying to gh-pages
      runs-on: ubuntu-latest
      steps:
        - name: Setup Node.js for use with actions
          uses: actions/setup-node@v1.1.0
          with:
            version:  16.8
          env:
            ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
        - name: Checkout branch
          uses: actions/checkout@v2
          env:
           ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'

        - name: Clean install dependencies
          run: yarn install
          env:
            ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'

        - name: Build app
          run: yarn generate
          env:
            ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'

        - name: deploy
          uses: peaceiris/actions-gh-pages@v3
          with:
           github_token: ${{ secrets.ACCESS_TOKEN }}
           publish_dir: ./dist
          env:
           ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'
```

</details>

And that's it! Now every time you push your repository to GitHub, this workflow will run, and the built pages will be pushed to a branch named `gh-pages` in your repository.

## Troubleshooting
If your go to your GitHub site (e.g. bob.github.io), you should see your page there. However, if you don't, try the following:
1. Ensure that your GitHub pages are deploying from the branch `gh-pages`. Go to **Settings > Pages**, and under source, there is a `Branch` option. Click it and select `gh-pages`.
2. Ensure that your `gh-pages` branch has an empty `.nojekyll` file in the root directory. If not, you can add one manually there (Make sure it's empty!).


Hope you enjoyed this post and that it has helped you!
