---
title: Hexo升级到8.1.0记录
date: 2026-07-07 10:30:00
categories: [工具]
tags: hexo
---

记录一下这次将博客升级到 Hexo 8.1.0 的过程，主要包括 Hexo 主程序升级、NexT 主题升级、无用默认主题清理，以及 `marked`、`stylus` 渲染器的补齐。

之前的 NexT 主题配置可以参考这篇文章：[hexo-next主题配置方式](https://cpfo.github.io/hexoblog/tools/hexo-next-theme/)。

<!-- more -->

## 升级前说明

这次升级前，博客主要使用 Hexo + NexT 主题。升级时没有直接在旧的 `node_modules` 上继续安装，而是先删除本地依赖和锁文件，让 npm 重新解析依赖版本。

需要注意的是，执行 `npm install hexo@8.1.0` 后，`package.json` 中通常会写入类似下面的版本范围：

```json
"hexo": "^8.1.0"
```

如果后续重新安装依赖，npm 可能会安装到 `8.1.x` 的较新补丁版本。如果必须固定在 `8.1.0`，可以使用：

```shell
npm install hexo@8.1.0 --save-exact
```

我这里主要目标是升级到 Hexo 8.1 系列，所以保留 npm 默认的版本范围即可。

## 清理旧依赖

先删除旧的依赖目录和 `package-lock.json`。

```shell
rm -rf node_modules
rm -f package-lock.json
```

这样做的好处是避免旧依赖残留影响升级结果，尤其是 Hexo、主题和渲染器这类插件之间存在版本配合关系时，重新安装会更干净。

## 升级 Hexo

安装 Hexo 8.1.0。

```shell
npm install hexo@8.1.0
```

然后更新项目中已有的其他 npm 依赖。

```shell
npm update
```

查看 `package.json`，确认 Hexo 和相关插件版本。

```shell
bat package.json
```

这里主要确认几个依赖是否已经更新：

```json
"hexo": "^8.1.0",
"hexo-renderer-marked": "^7.0.1",
"hexo-renderer-stylus": "^3.0.1",
"hexo-theme-next": "^8.28.0"
```

实际版本以本地安装结果为准。

升级完成后的 `package.json` 可以参考下面的内容：

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "8.1.2"
  },
  "dependencies": {
    "@waline/hexo-next": "^3.0.1",
    "hexo": "^8.1.0",
    "hexo-cli": "^4.3.1",
    "hexo-deployer-git": "^4.0.0",
    "hexo-filter-mermaid-diagrams": "^1.0.5",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-searchdb": "^1.4.1",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^7.0.1",
    "hexo-renderer-stylus": "^3.0.1",
    "hexo-server": "^3.0.0",
    "hexo-symbols-count-time": "^0.7.1",
    "hexo-theme-next": "^8.28.0"
  }
}
```

其中 `hexo.version` 是 Hexo 运行后记录的实际版本，`dependencies.hexo` 中的 `^8.1.0` 是 npm 依赖版本范围。

## 升级 NexT 主题

之前使用 NexT 主题时，主要配置可以参考旧文章：[hexo-next主题配置方式](https://cpfo.github.io/hexoblog/tools/hexo-next-theme/)。

这次升级直接安装 npm 上最新的 NexT 主题包。

```shell
npm install hexo-theme-next@latest
```

安装完成后，将主题默认配置复制到博客根目录。

```shell
cp node_modules/hexo-theme-next/_config.yml _config.next.yml
```

这种方式是 Hexo 推荐的主题配置方式之一：主题包仍然放在 `node_modules` 中，自己的主题配置放在项目根目录的 `_config.next.yml` 中。后续升级主题时，不需要直接修改 `node_modules` 里面的文件。

如果之前已经有自己的 `_config.next.yml`，不要直接覆盖，可以先对比新旧配置，再把需要的配置迁移过去。

如果之前是通过 `themes/next` 目录安装和配置 NexT 主题，那么旧的主题配置通常在：

```shell
themes/next/_config.yml
```

需要把旧配置中自己修改过的内容合并到新的根目录配置文件：

```shell
_config.next.yml
```

这里不要直接整体覆盖，因为新版 NexT 的默认配置项可能已经有调整。更稳妥的方式是对比两个文件，只迁移自己改过的配置，例如主题风格、菜单、头像、代码高亮、搜索、评论、统计、阅读时长等配置。

确认 `_config.next.yml` 已经合并完成，并且本地预览正常后，就可以删除旧的 `themes/next` 目录。

```shell
rm -rf themes/next
```

删除后，项目会使用 `node_modules/hexo-theme-next` 中的主题文件，以及根目录 `_config.next.yml` 中的自定义配置。

## 第一次验证

升级 Hexo 和 NexT 后，先清理并重新生成静态文件，再启动本地服务验证。

```shell
hexo clean && hexo g && hexo s
```

这里主要检查：

1. 文章是否能正常生成。
2. NexT 主题样式是否正常加载。
3. 首页、分类、标签、归档页面是否正常。
4. 搜索、评论、阅读统计等自定义功能是否正常。

如果生成 Markdown 文章时报错，可以继续升级 Markdown 渲染器。

## 升级 marked 渲染器

Hexo 文章默认需要 Markdown 渲染器。这里升级 `hexo-renderer-marked` 到最新版本。

```shell
npm install hexo-renderer-marked@latest
```

升级后再次检查文章页面，尤其是代码块、列表、表格、引用、图片这些 Markdown 内容是否渲染正常。

## 移除默认 landscape 主题

项目中已经使用 NexT 主题，不再需要 Hexo 默认的 `landscape` 主题，可以卸载掉。

```shell
npm uninstall hexo-theme-landscape
```

卸载后再次执行生成和本地预览。

```shell
hexo clean && hexo g && hexo s
```

如果 `_config.yml` 中仍然配置的是：

```yaml
theme: landscape
```

需要改成：

```yaml
theme: next
```

否则卸载 `hexo-theme-landscape` 后，Hexo 会找不到主题。

## 升级 stylus 渲染器

NexT 主题样式依赖 stylus 渲染能力，因此也需要确认 `hexo-renderer-stylus` 已经安装。

```shell
npm install hexo-renderer-stylus@latest
```

如果缺少这个依赖，可能会遇到主题样式没有正常生成、页面没有 CSS 或构建时报 stylus 相关错误的问题。

## 完整命令记录

这次主要执行的命令如下：

```shell
rm -rf node_modules
rm -f package-lock.json
npm install hexo@8.1.0
npm update
bat package.json
npm install hexo-theme-next@latest
cp node_modules/hexo-theme-next/_config.yml _config.next.yml
# 合并 themes/next/_config.yml 中的自定义配置到 _config.next.yml
rm -rf themes/next
hexo clean && hexo g && hexo s
npm install hexo-renderer-marked@latest
npm uninstall hexo-theme-landscape
hexo clean && hexo g && hexo s
npm install hexo-renderer-stylus@latest
```

## 总结

这次升级的核心思路是先清理旧依赖，再重新安装 Hexo 8.1.0 和相关插件。NexT 主题改为通过 `hexo-theme-next` npm 包安装，并使用根目录的 `_config.next.yml` 维护主题配置。

升级完成后，建议至少执行一次完整验证：

```shell
hexo clean && hexo g && hexo s
```

确认本地预览没有问题后，再执行部署流程。
