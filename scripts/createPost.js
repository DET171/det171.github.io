const fs = require('fs');
const path = require('path');

const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

fs.writeFileSync(path.join(__dirname, '../app/daily-shitposts/posts/', `${date}.mdx`), `---
date: ${date}
---
`);

