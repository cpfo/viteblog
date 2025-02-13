# 使用vitepress搭建个人网站

## 安装

主要参考官方文档，一步步往下操作。 [getting-started](https://vitepress.dev/zh/guide/getting-started)

* 安装
> npm add -D vitepress

* 命令行设置向导，按照提示进行操作

> npx vitepress init

:::warning 注意
这一步在git bash中执行会报错，切换到windows cmd或者终端就可以了

```shell
SystemError [ERR_TTY_INIT_FAILED]: TTY initialization failed: uv_tty_init returned EBADF (bad file descriptor)
    at new SystemError (node:internal/errors:259:5)
    at new NodeError (node:internal/errors:370:7)
    at new WriteStream (node:tty:93:11)
  code: 'ERR_TTY_INIT_FAILED',
  info: {
    errno: -4083,
    code: 'EBADF',
    message: 'bad file descriptor',
    syscall: 'uv_tty_init'
  },
  errno: [Getter/Setter],
  syscall: [Getter/Setter]
}

Node.js v20.10.0

```
:::

## 目录结构

建议将站点搭建在嵌套目录 (例如 ./docs) 中，以便它与项目的其余部分分开。

假设选择在 ./docs 中搭建 VitePress 项目，生成的文件结构应该是这样的：

```shell
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

`docs` 目录作为 VitePress 站点的项目**根目录**。`.vitepress` 目录是 VitePress 配置文件、开发服务器缓存、构建输出和可选主题自定义代码的位置。

* **gitignore**

```
node_modules
/**/.vitepress/cache
/**/.vitepress/dist

```

## 导航 nav

参考 [default-theme-nav](https://vitepress.dev/zh/reference/default-theme-nav) .

可以支持下拉，下拉菜单中还支持分组

```
    nav: [
      { text: '首页', link: '/' },
      { text: '🌰示例', link: '/example/markdown-examples' },
      { text: '编程语言', 
        items: [
          { text: 'java', link: '/java/' },
          { text: 'python', link: '/python/' },
        ]
       },
       { text: '🛠️工具', link: '/tools/' },
       { text: '🧭导航', 
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
```

## 侧边栏 sidebar

参考 [default-theme-sidebar](https://vitepress.dev/zh/reference/default-theme-sidebar) .

每个 `link` 都应指定以 `/` 开头的实际文件的路径。如果在链接末尾添加斜杠，它将显示相应目录的 `index.md`

```
export default {
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          // 显示的是 `/guide/index.md` 页面
          { text: 'Introduction', link: '/guide/' }
        ]
      }
    ]
  }
}
```

### 多侧边栏

可能会根据页面路径显示不同的侧边栏。例如，如本站点所示，可能希望在文档中创建单独的侧边栏，例如“指南”页面和“配置参考”页面。

为此，首先将你的页面组织到每个所需部分的目录中：

```
.
├─ guide/
│  ├─ index.md
│  ├─ one.md
│  └─ two.md
└─ config/
   ├─ index.md
   ├─ three.md
   └─ four.md
```

然后，更新配置以定义每个部分的侧边栏。这一次，应该传递一个对象而不是数组。

### 可折叠侧边栏

通过向侧边栏组添加 collapsed 选项，它会显示一个切换按钮来隐藏/显示每个部分


示例：

```
export default {
  themeConfig: {
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Index', link: '/guide/' },
            { text: 'One', link: '/guide/one' },
            { text: 'Two', link: '/guide/two' }
          ]
        }
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/config/': [
        {
          text: 'Config',
          collapsed: true,
          items: [
            { text: 'Index', link: '/config/' },
            { text: 'Three', link: '/config/three' },
            { text: 'Four', link: '/config/four' }
          ]
        }
      ]
    }
  }
}
```

## 首页布局

* [default-theme-home-page](https://vitepress.dev/zh/reference/default-theme-home-page)


:::warning
配置首页布局features时，注意编辑器，不要即有空格，又有 tab ，要保持一致。

:::

## mermaid支持

安装地址  [vitepress-plugin-mermaid](https://emersonbottero.github.io/vitepress-plugin-mermaid/guide/getting-started.html) 

* import

> import { withMermaid } from "vitepress-plugin-mermaid";

要把原来配置 `export default defineConfig` 中的  `defineConfig` 改为 `withMermaid`

```
// .vitepress/config.js
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
    // your existing vitepress config...
    // optionally, you can pass MermaidConfig
    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: "mermaid my-class", // set additional css classes for parent container 
    },
});
```

* 效果

```mermaid
flowchart LR
  Start --> Stop
```

## 部署到github pages

[deploy to github pages](https://vitepress.dev/zh/guide/deploy)


如果不是从master，main等默认分支部署，比如从 test 分支部署，可能遇到下面的错误
:::warning Branch "xxx" is not allowed to deploy to github-pages due to environment protection rules

[branch-master-is-not-allowed-to-deploy-to-github-pages-due-to-environment-prot](https://stackoverflow.com/questions/76937061/branch-master-is-not-allowed-to-deploy-to-github-pages-due-to-environment-prot)

解决办法

1. Go to you repository Settings.
2. Click on Environments.
3. Select your environment github-pages.
4. Next to Deployment branches select Selected branches from the dropdown.
5. Click on Add deployment branch rule.
6. Enter the pattern master.
:::