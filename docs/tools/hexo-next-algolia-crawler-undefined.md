---
title: Hexo + NexT 使用 Algolia Crawler 搜索点击跳转 undefined 的解决方案
date: 2026-08-04 09:28:49
categories: [工具]
tags: [hexo, NexT, Algolia]
---

记录一下 Hexo 博客使用 NexT 主题接入 Algolia Crawler 后，搜索结果能够正常返回，但点击结果却跳转到 `undefined` 地址的问题和解决方案。

<!-- more -->

## 官方方案与 Crawler 方案的区别

根据 [NexT 官方文档](https://theme-next.js.org/docs/third-party-services/search-services)，只在 NexT 配置文件中开启 `algolia_search`，并不能完整使用 Algolia 搜索。官方方案还需要安装以下插件之一，用于生成索引数据并上传到 Algolia：

- `hexo-algolia`
- `hexo-algoliasearch`

官方方案的处理流程为：

```text
Hexo 文章 -> Hexo Algolia 插件 -> Algolia 索引 -> NexT 搜索
```

本文使用的不是 Hexo 插件，而是 **Algolia Crawler**。Crawler 会抓取已经部署的博客页面，并将提取的数据写入 Algolia 索引，因此可以替代插件完成索引生成和上传：

```text
已部署的 Hexo 页面 -> Algolia Crawler -> Algolia 索引 -> NexT 搜索
```

需要注意的是，Crawler 只替代了官方流程中“生成并上传索引”的部分。NexT 前端仍然需要 Algolia 的应用 ID、Search-only API Key 和索引名称，才能连接 Algolia Search API。

## 配置 Algolia 搜索

使用 Crawler 建立索引后，需要分别配置 Hexo 和 NexT。

### 配置 Hexo

在博客根目录的 Hexo 配置文件 `_config.yml` 中添加：

```yaml
algolia:
  appId: xxx
  apiKey: xxx
  indexName: xxx
```

各配置项的作用如下：

- `appId`：Algolia Application ID。
- `apiKey`：Algolia Search-only API Key，仅用于前端搜索。
- `indexName`：Crawler 写入数据的索引名称，必须与 Crawler 配置中的 `indexName` 保持一致。

这里的 `apiKey` 会随静态页面发送到浏览器，因此只能填写 **Search-only API Key**。不要填写 Admin API Key 或用于写入索引的高权限 Key，否则会暴露索引管理权限。

### 配置 NexT

在 NexT 配置文件 `_config.next.yml` 中开启 Algolia 搜索：

```yaml
algolia_search:
  enable: true
  hits:
    per_page: 10
```

如果同时配置了 Local Search，需要将其关闭，避免同时启用多个搜索实现：

```yaml
local_search:
  enable: false
```

这两部分配置的职责不同：

- `_config.yml` 中的 `algolia` 提供连接 Algolia 所需的应用、Key 和索引信息。
- `_config.next.yml` 中的 `algolia_search` 控制 NexT 是否加载并显示 Algolia 搜索功能。
- Algolia Crawler 负责抓取博客页面、生成记录并写入索引。

三部分都配置完成后，NexT 才能查询由 Crawler 创建的索引。

## 问题现象

完成上述配置后，搜索能够正常返回结果，但是点击搜索结果时，页面却跳转到了：

```text
https://cpfo.github.io/hexoblog/undefined
```

浏览器请求 Algolia Search API 返回的数据类似：

```json
{
  "objectID": "https://cpfo.github.io/hexoblog/yunwei/nginx-deny-host/",
  "title": "nginx拦截非法host的请求 | 笔记",
  "description": "...",
  "url": "https://cpfo.github.io/hexoblog/yunwei/nginx-deny-host/",
  "path": "/hexoblog/yunwei/nginx-deny-host/",
  "content": "..."
}
```

可以看到索引中**没有 `permalink` 字段**。

## 原因分析

NexT 官方的 Algolia Search 是按照 `hexo-algolia` 插件生成的数据结构实现的。

搜索源码（`source/js/third-party/search/algolia-search.js`）中默认请求：

```javascript
attributesToRetrieve: ['permalink']
```

并且点击搜索结果时使用：

```javascript
href="${data.permalink}"
```

而 **Algolia Crawler** 默认生成的数据结构为：

```json
{
  "url": "...",
  "path": "...",
  "title": "...",
  "description": "...",
  "content": "...",
  "objectID": "..."
}
```

并不会生成 `permalink` 字段，因此：

```javascript
data.permalink === undefined
```

最终导致跳转地址变成：

```text
https://cpfo.github.io/hexoblog/undefined
```

## 正确的解决方案

无需修改 NexT 源码，只需要让 **Crawler** 生成兼容 NexT 的 `permalink` 字段即可。

将 `recordExtractor` 修改如下：

```javascript
actions: [
  {
    indexName: "hexoblog_pages",
    pathsToMatch: ["https://cpfo.github.io/hexoblog/**"],

    recordExtractor: ({ url, $, helpers, contentLength, fileType }) => {
      const records = helpers.page({
        $,
        url,
        contentLength,
        fileType
      });

      return records.map(record => ({
        ...record,

        // 兼容 NexT 官方 Algolia Search
        permalink: record.url || url,

        // 兼容 hexo-algolia 数据结构
        excerpt: record.description || "",

        // 防止 path 缺失
        path: record.path || new URL(record.url || url).pathname
      }));
    }
  }
]
```

重新运行 Crawler 后，索引会变成：

```json
{
  "objectID": "...",
  "permalink": "https://cpfo.github.io/hexoblog/yunwei/nginx-deny-host/",
  "url": "https://cpfo.github.io/hexoblog/yunwei/nginx-deny-host/",
  "path": "/hexoblog/yunwei/nginx-deny-host/",
  "title": "...",
  "description": "...",
  "excerpt": "...",
  "content": "..."
}
```

此时无需修改 NexT 源码，搜索结果即可正常跳转。

## 为什么推荐修改 Crawler？

虽然也可以直接修改 NexT 的 `algolia-search.js`，兼容 `url` 或 `objectID` 字段，但并不推荐。

原因如下：

- 修改 `node_modules` 后，执行 `npm install` 或升级主题时容易被覆盖。
- Crawler 统一生成兼容字段后，所有依赖 `permalink` 的主题都可以直接使用。
- 保持 NexT 官方代码不变，后续升级维护更加方便。

因此，对于使用 **Algolia Crawler + NexT** 的场景，推荐在 **Crawler** 中补充 `permalink` 字段，而不是修改主题源码。
