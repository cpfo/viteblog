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
      // { text: '🌰示例', link: '/example/markdown-examples' },
      {
        text: '编程语言',
        items: [
          { text: 'java', link: '/java/' },
          { text: 'python', link: '/python/' },
          { text: 'go', link: '/go/' },
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'es', link: '/java/es/es-01-install' },
          { text: 'db', link: '/db/' },
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


    /** 
    sidebar: {
      '/example/': [
        {
          text: '使用示例',
          collapsed: true,
          items: [
            { text: 'Markdown Examples', link: '/example/markdown-examples' },
            { text: 'Runtime API Examples', link: '/example/api-examples' }
          ]
        }
      ],
      '/java/': [
        {
   
          text: 'elasticsearch',
          collapsed: false,
          items: [
            { text: 'es安装', link: '/java/es/es-01-install' },
            { text: 'es索引和文档操作', link: '/java/es/es-02-index-mapping' },
            { text: 'es DSL查询', link: '/java/es/es-04-dsl-search' },
            { text: 'es REST api使用', link: '/java/es/es-03-rest-api' },
            { text: 'es自动补全和数据同步', link: '/java/es/es-05-autocomplete-mysql-sync' },
          ]
        },
        {
          text: 'java',
          items: [
            { text: 'shardingsphere分库分表', link: '/java/shardingsphere分库分表' },
            { text: '百度uid-generator生成的id变成负数', link: '/java/snowflake-baidu-uid-generator' },
            { text: '使用RateLimiter进行限流', link: '/java/使用RateLimiter进行限流' },
            { text: 'jdk免登录下载', link: '/java/jdk-download.md' },
          ]
        }
      ],
      '/tools/': [
        {
          text: '博客工具',
          collapsed: false,
          items: [
            { text: '使用docsify搭建个人博客', link: '/tools/docsify-config' },
            { text: 'hexo的使用', link: '/tools/hexo使用' },
            { text: 'hexo的next主题配置', link: '/tools/hexo-next-theme' },
            { text: 'vitepress创建博客', link: '/tools/vitepress-build-blog' },
            { text: 'jsdelivr加速资源', link: '/tools/use-jsdelivr-cdn-hexo-blog' },
          ]
        }
      ],
      '/go/': [
        {
          text: 'go语言',
          collapsed: false,
          items: [
            { text: 'go环境安装', link: '/go/go环境安装' },
            { text: 'go语言变量和运算符', link: '/go/go语言变量和运算符' },
            { text: 'go语言结构和基础语法', link: '/go/go语言结构和基础语法' },
          ]
        }
      ],
      '/dev-tools/': [
        {
          text: '开发工具',
          collapsed: false,
          items: [
            { text: 'docker的使用', link: '/dev-tools/docker-use' },
            { text: 'miniconda的使用', link: '/dev-tools/miniconda-use' },
            { text: 'Vs Code的使用', link: '/dev-tools/VsCode-use' },
            { text: 'git的使用', link: '/dev-tools/git-command' },
          ]
        }
      ],
      '/python/': [
        {
          text: 'python知识点',
          collapsed: false,
          items: [
            { text: '1.python基础', link: '/python/1.python基础' },
            { text: '2.python函数', link: '/python/2.python函数' },
            { text: '3.python高级特性', link: '/python/3.python高级特性' },
            { text: '4.python函数式编程', link: '/python/4.python函数式编程' },
            { text: '5.python模块', link: '/python/5.python模块' },
            { text: '6.python面向对象编程', link: '/python/6.python面向对象编程' },
            { text: '7.python面向对象高级编程', link: '/python/7.python面向对象高级编程' },
            { text: '8.python错误和调试', link: '/python/8.python错误和调试' },
            { text: '9.python的IO编程', link: '/python/9.python的IO编程' },
            { text: '10.python进程和线程', link: '/python/10.python进程和线程' },
            { text: '11.python正则表达式', link: '/python/11.python正则表达式' },
            { text: '12.1python常用内建模块1', link: '/python/12.1python常用内建模块1' },
            { text: '12.2python常用内建模块2', link: '/python/12.2python常用内建模块2' },
            { text: '12.3python常用内建模块3', link: '/python/12.3python常用内建模块3' },
            { text: '13.python常用第三方模块', link: '/python/13.python常用第三方模块' },
            { text: '14.python图形界面', link: '/python/14.python图形界面' },
            { text: '15.python网络编程', link: '/python/15.python网络编程' },
            { text: '16.python电子邮件', link: '/python/16.python电子邮件' },
            { text: '17.python访问数据库', link: '/python/17.python访问数据库' },
            { text: '18.python-web开发', link: '/python/18.python-web开发' },
            { text: '19.python异步IO', link: '/python/19.python异步IO' },
          ]
        }
      ],
    },

    */
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




