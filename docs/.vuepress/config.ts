import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { bar } from './configs'

export default defineUserConfig<DefaultThemeOptions>({
    base: '/',
    lang: 'zh-CN',
    title: 'Archive',
    description: 'Archive | Blog',
    head: [
        ['link', { rel: 'icon', href: 'https://vuejs.org/images/logo.png' }]
    ],
    // host: '127.0.0.1',
    // port: 33,
    // theme: 'antdocs',

    themeConfig: {
        logo: 'https://vuejs.org/images/logo.png',

        repo: 'arytry/archive',
        editLink: false,    // 展示 repo 的编辑路径
        // editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: false,
        // lastUpdatedText: '上次更新',

        contributors: false,
        // contributorsText: '贡献者',

        navbar: bar.navbar(),
        sidebar: bar.sidebar(),
        sidebarDepth: 4,
    }
})
