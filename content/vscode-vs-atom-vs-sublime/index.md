---
title: Comparing VS Code, Atom, and Sublime Text
description: Pros and cons of VS Code, Atom, and Sublime Text, as well ad their ratings
---
## Comparing VS Code, Atom, and Sublime
These three text editors are among the most popular (and recommended). You might be spoilt for choice, but this article aims to help you decide on which text editor to choose. I will rate them, but for each sections, the rating is relative (The first will be 100% points, the last will be 0%)<br>
*Note: I will try to be as un-biased as possible*
### Pricing
You might think, *"Hey, it's just a text editor! How can it cost me money?"* <br>
Well, if you think this way, you are wrong! Sublime text costs a whopping $99 USD! If you decide to purchase Sublime Merge as well, the price is $168 USD! <br>
That being said, Sublime has a lot of other features as well, and is better than both VS Code and Atom in performance (we'll cover that later on). <br>
I don't have anything much to say for Atom and VS Code, as they're both free.
#### Score:
1. Atom (10/10)
1. VS Code (10/10)
2. Sublime Text (0/10)

### Performance
As mentioned earlier on, Sublime has a much better performance than the other two. Both VS Code and Atom are made with [Electron](https://www.electronjs.org/), which has a...well, bad performance when it comes to starting up. However, VS Code still has a faster starting time than Atom. Atom also tends to be sluggish when editing large files, and can result in a bad experience. (A good UX is very important, so the scores for this section will be out of 20).
#### Score
1. Sublime Text (20/20)
2. VS Code (11/20)
3. Atom (0/20)

## Design
Design can be very subjective, and it varies from person to person. I will give you my opinion, but as I said, since it's very subjective, don't scream at me if you think I rated the editors wrongly. <br>
Both VS Code and Atom look good, but VS Code's settings and sidebar look cramped, while Atom's  has larger paddings and gives you a feel of spaciousness. Sublime Text also looks great (and spacious).
#### Score
1. Atom (10/10)
2. Sublime Text (9.9/10)
3. VS Code (0/10) (and yeah I'm sorry VS Code fans this is what it gets)

## Configuration
Configuration in Atom is very simple, and can be done in the `Settings` tab. You can access it by using `Ctrl` + `,`, or go to `File` > `Settings`. You can also access `Settings` in VS Code by using `Ctrl` + `,`, or `File` > `Preferences` > `Settings`. It's all done with GUIs in these two editors, but for Sublime Text, the configuration/settings are stored in JSON files (which can be confusing sometimes).
#### Score
1. Atom (10/10)
2. VS Code (10/10)
3. Sublime Text (0/10)

## Git
Being a product of GitHub, Atom has a built in GitHub Desktop extension, which means you can push/pull/fetch from your text editor! All the functions are located at the bottom of the screen, and does not require you to navigate to a different menu. Atom also colours your files based on whether they were edited, or created (brown for edited files, green for new files). <br>
VS Code also has this feature, but committing files require you to click on `Source Control` at the side of the screen, or press `Ctrl` + `Shift` + `G`. Pushing/pulling/fetching requires you to open yet another menu, while for Atom, the fetch/pull/push button is located at the bottom-left corner.
<details>
<summary>See Atom Git Extension image</summary>
<v-img src="atom-git.png" alt="Atom Git extension" />
</details>


It's even more troublesome for Sublime Text. You have to download and install [Sublime Merge](https://www.sublimemerge.com/) (and yes, you guessed it! That costs money as well!).

#### Score
1. Atom (10/10)
2. VS Code (8.5/10) (I'm feeling kind)
3. Sublime Text (0/10)

## Core Features
Core features are probably the most important things you'd consider when choosing a text editor. Atom has less core features compared to VS Code and Sublime, but what it lacks in core features, it makes up for in packages. As of 7/9/2021, Atom has 9,133 published packages. But still, it's a hassle to search for all the packages you need and install them. VS Code has built-in IntelliSense support and JS and TS autocompletion. Sublime has more core features than Atom as well, one of which is a built-in Python Terminal (which is next to useless if you don't use Python). VS Code has a built-in Terminal, and you can choose from Command Prompt or PowerShell (default) on Windows.
#### Score
1. VS Code (10/10)
2. Sublime Text (6.99999999999999/10)
3. Atom (0/10)

## Plugins, Extensions, and Packages (same thing)
Atom has a lot of packages, most of which are provided by the community. However, Atom does offer some official packages and core packages, which come installed with Atom. You cannot uninstall core packages but can disable them, and the features they provide are similar to the core features of other editors. But again, they are packages that provide features and without them, Atom wouldn't have a lot of its features, so it wasn't included in the above section. LOL 🤣.<br>
VS Code also has a lot of plugins and extensions made by various people, and so does Sublime Text.
All three editors have tons of plugins, so...
#### Score
*Unrated*

## Development of editors
Active development and contribution is very important for an application. Nobody wants to use an application that's been left untouched by the devs for years, and active development can also mean quicker bug fixes and stuff like that. A large contributor group can also mean better support for customers. Let's take a look at the stats according to [Shields.io](https://shields.io/)...
#### Atom
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/atom/atom?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/atom/atom?style=flat-square)
#### VS Code
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/microsoft/vscode?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/microsoft/vscode?style=flat-square)
#### Sublime Text
*Unknown*<br>
However, considering that it's paid, let's assume it's not too bad...
#### Score
1. VS Code (10/10)
2. Sublime Text (8.5/10)
3. Atom (7/10) (exception due to Sublime Text's missing data)

## Final Scores
1. VS Code (59.5/80)
2. Atom (47/80)
3. Sublime Text (44.5/80)

## Conclusion
VS Code is the most prevalent choice among developers due to its average to good performance, powerful features and good UX/UI. Atom is another good choice, having a lot of extensions which are enough to satisfy the average developer. It is also very customisable, and has a great flight manual. Lastly, Sublime is a very powerful text editor with lightning-fast performance and loads of extensions. It is also easy to configure through JSON (for people who prefer setting values via JSON than GUI).<br>
Ultimately, it is still down to you, the user, to decide which editor suits you the most.<br>
PS If you want me to add a criteria or think I rated anything wrongly, you can email me (my email is at the bottom of the [About page](/blog/about)) with a suggestion of how I should change it.
