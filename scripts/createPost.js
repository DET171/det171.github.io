const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const console = require('consola');

const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

fs.writeFileSync(path.join(__dirname, '../app/daily-shitposts/posts/', `${date}.mdx`), '');

console.success(chalk.green(`Created post for ${date}!`));
