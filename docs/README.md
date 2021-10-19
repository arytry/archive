---
home: false
title: 首页
---

本系列文章基于vuepress搭建

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
# install in your project
yarn add -D vuepress@next
# create a markdown file
echo '# Hello VuePress' > README.md
# start writing
yarn vuepress dev
# build to static files
yarn vuepress build
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
# install in your project
npm install -D vuepress@next
# create a markdown file
echo '# Hello VuePress' > README.md
# start writing
npx vuepress dev
# build to static files
npx vuepress build
```

  </CodeGroupItem>
</CodeGroup>