import { defineConfig } from 'vitepress'

import { withMermaid } from 'vitepress-plugin-mermaid'

import generateSidebar from './scripts/sidebar'
const docsRoot = './docs'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "个人知识库",
  description: "个人知识库，记录工作和学习中遇到的问题，以及知识的积累。",
  lastUpdated: true,
  base: '/viteblog/',
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '🌰示例', link: '/example/markdown-examples' },
      {
        text: '编程语言',
        items: [
          {
            text: 'java',
            items: [
              { text: '首页', link: '/java/' },
              { text: 'ES', link: '/java/es/' },
            ]
          },
          { text: 'python', link: '/python/' },
          { text: 'go', link: '/go/' },
        ]
      },
      {
        text: '数据库',
        items: [
          { text: '数据库文档', link: '/db/' },
        ]
      },
      { text: '🛠️博客工具', link: '/tools/' },
      { text: '开发工具', link: '/dev-tools/' },
      {
        text: '🧭导航',
        items: [
          {
            text: "导航1",
            items: [
              { text: 'baidu', link: 'https://www.baidu.com/' }
            ]
          },
          {
            text: "导航2",
            items: [
              { text: 'google', link: 'https://www.google.com/' }
            ]
          }
        ]
      }
    ],


    sidebar: {
      // 为不同路径生成侧边栏（支持多组配置）
      '/example/': generateSidebar(docsRoot, 'example'),
      '/java/': generateSidebar(docsRoot, 'java'),
      '/python/': generateSidebar(docsRoot, 'python'),
      '/go/': generateSidebar(docsRoot, 'go'),
      '/tools/': generateSidebar(docsRoot, 'tools'),
      '/dev-tools/': generateSidebar(docsRoot, 'dev-tools'),
      '/db/': generateSidebar(docsRoot, 'db'),
      
      // 默认侧边栏（根目录下的文档）
      // '/': generateSidebar(docsRoot)
    },


    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    outline: {
      // level: 'deep',
      level: [1, 3],
      "label": '页面导航'
    },
    footer: {
      message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>',
      copyright: `Copyright © 2025-present` 
    },
    search: {
      provider: 'algolia',

      options: {
        appId: 'AI6V64HIFP',
        apiKey: '006907fdc19ae2ba1c00449055a2c0b7',
        indexName: 'cpfoio',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            }
          }
        }
      }

    },
    editLink: {
      pattern: 'https://github.com/cpfo/blog-tools/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
  // optionally, you can pass MermaidConfig
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container 
  },
});




