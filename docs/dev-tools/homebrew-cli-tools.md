---
title: Mac 常用 Homebrew 命令行工具整理
date: 2026-07-10 00:00:00
categories: [工具]
tags: [Homebrew, Mac, CLI]
---

在 Mac 上用 Homebrew 安装命令行工具，可以把很多系统自带命令升级成更高效、更现代的版本。比如文件搜索、目录查看、系统监控、网络调试、媒体处理、Java/Node 环境管理等，都可以通过一套统一的命令完成安装和更新。

<!-- more -->

## 安装和维护

常见的 Homebrew 操作如下：

```shell
# 搜索软件
brew search ripgrep

# 查看软件信息
brew info ripgrep

# 安装软件
brew install ripgrep

# 更新 Homebrew 索引
brew update

# 升级已安装软件
brew upgrade

# 查看已安装软件
brew list

# 列出所有叶子包
brew leaves

# 只列出你手动安装的叶子包（常用，看自己主动装了啥）
brew leaves -r

# 卸载软件
brew uninstall ripgrep

# 清理旧版本缓存
brew cleanup
```

如果想把当前安装的软件保存下来，方便换机器恢复，可以使用 `brew bundle`：

```shell
# 导出 Brewfile
brew bundle dump --file Brewfile

# 在新机器按 Brewfile 安装
brew bundle install --file Brewfile
```

## 文件和目录工具

### eza

`eza` 是 `ls` 的现代替代品，输出更清晰，支持图标、Git 状态、树形目录等功能。

好处：

- 比 `ls` 更易读，颜色和文件类型区分更明显。
- 可以直接显示 Git 状态，适合开发目录。
- 树形展示比 `tree` 更适合和文件详情一起使用。

常见操作：

```shell
# 列出文件详情
eza -l

# 显示隐藏文件
eza -la

# 按树形结构显示两层目录
eza --tree --level=2

# 显示 Git 状态
eza -la --git
```

可以在 `~/.zshrc` 中加别名：

```shell
alias ls='eza'
alias ll='eza -la --git'
alias tree='eza --tree'
```

### fd

`fd` 是 `find` 的替代品，语法更简单，默认忽略 `.gitignore` 中的文件，搜索速度也更快。

好处：

- 命令更短，不需要写复杂的 `find . -name`。
- 默认彩色输出，可读性更好。
- 和 `xargs`、`fzf`、编辑器结合非常方便。

常见操作：

```shell
# 查找 markdown 文件
fd '\.md$'

# 查找文件名包含 config 的文件
fd config

# 包含隐藏文件
fd -H config

# 在指定目录查找
fd package source

# 找到后执行命令
fd '\.log$' -x rm {}
```

### ripgrep

`ripgrep` 的命令是 `rg`，可以替代 `grep`，用于全文搜索。它默认尊重 `.gitignore`，在代码仓库里搜索非常快。

好处：

- 搜索速度快，适合大项目。
- 默认递归搜索当前目录。
- 支持正则、文件类型过滤、上下文显示。

常见操作：

```shell
# 搜索关键字
rg "Homebrew"

# 搜索指定文件类型
rg "function" -t js

# 显示上下文
rg "error" -C 2

# 只显示文件名
rg -l "TODO"

# 忽略大小写
rg -i "readme"
```

### tree

`tree` 用于以树形结构展示目录。虽然 `eza --tree` 也能做类似事情，但 `tree` 输出稳定，适合写文档、生成目录结构说明。

常见操作：

```shell
# 显示当前目录树
tree

# 只显示两层
tree -L 2

# 忽略 node_modules 和 .git
tree -L 2 -I 'node_modules|.git'
```

### bat

`bat` 是 `cat` 的增强版，支持语法高亮、行号、Git 修改标记和分页显示。

好处：

- 查看代码比 `cat` 清楚。
- 自动分页，长文件不会一次刷满终端。
- 支持显示不可见字符、指定语言高亮。

常见操作：

```shell
# 查看文件
bat README.md

# 不分页输出，适合管道
bat --paging=never README.md

# 显示指定行范围
bat -r 10:30 README.md

# 作为 cat 使用
bat -pp README.md
```

可以设置别名：

```shell
alias cat='bat'
```

## 磁盘和系统监控

### btop

`btop` 是 `top`、`htop` 的现代替代品，用于查看 CPU、内存、磁盘、网络和进程情况。

好处：

- 界面直观，适合快速定位资源占用。
- 支持鼠标操作和进程管理。
- 比系统自带 `top` 更易读。

常见操作：

```shell
# 启动监控
btop
```

进入界面后常用操作：

- `q` 退出。
- 方向键选择进程。
- `f` 过滤进程。
- `k` 结束进程。
- `m` 切换显示模式。

### duf

`duf` 是 `df` 的替代品，用于查看磁盘分区和挂载点空间使用情况。

好处：

- 表格更清晰，默认带颜色。
- 自动按设备、文件系统分类。
- 比 `df -h` 更适合日常查看。

常见操作：

```shell
# 查看磁盘空间
duf

# 只显示本地磁盘
duf --only local

# 输出 JSON，方便脚本处理
duf --json
```

### dust

`dust` 是 `du` 的替代品，用于分析目录占用空间。

好处：

- 输出层级清楚，能快速找出大目录。
- 默认结果更适合人阅读。
- 比 `du -sh *` 更直观。

常见操作：

```shell
# 查看当前目录空间分布
dust

# 指定目录
dust ~/Downloads

# 限制显示层级
dust -d 2

# 只显示前 20 个结果
dust -n 20
```

### ncdu

`ncdu` 也是磁盘分析工具，和 `dust` 的区别是它提供交互式界面，适合手动清理大文件。

好处：

- 可以进入目录逐层查看。
- 能在界面里删除文件。
- 适合清理下载目录、缓存目录、构建产物。

常见操作：

```shell
# 分析当前目录
ncdu

# 分析指定目录
ncdu ~/Downloads

# 排除目录
ncdu --exclude node_modules
```

进入界面后常用操作：

- 方向键移动。
- 回车进入目录。
- `d` 删除选中的文件或目录。
- `q` 退出。

### fastfetch

`fastfetch` 类似 `neofetch`，用于显示系统信息，比如 macOS 版本、CPU、内存、Shell、终端、主题等。

常见操作：

```shell
# 显示系统信息
fastfetch

# 生成默认配置
fastfetch --gen-config
```

可以把它放到终端启动脚本中，但不建议每次打开终端都执行太多信息展示，否则会拖慢启动速度。

## 交互和终端效率

### fzf

`fzf` 是命令行模糊查找工具，可以和历史命令、文件搜索、Git 分支、进程选择结合使用。

好处：

- 输入一部分字符就能快速筛选目标。
- 可以接收任意列表输入，通用性很强。
- 配合 `fd`、`rg`、`zoxide` 后效率很高。

常见操作：

```shell
# 从当前目录文件中选择
fd --type f | fzf

# 搜索历史命令
history | fzf

# 选择 Git 分支并切换
git branch | fzf | xargs git checkout
```

安装后可以启用 shell 集成，常见快捷键：

- `Ctrl + R` 搜索历史命令。
- `Ctrl + T` 搜索文件并插入命令行。
- `Alt + C` 搜索目录并进入。

### zoxide

`zoxide` 是 `cd` 的智能替代工具，会记录你访问过的目录，然后用关键词快速跳转。

好处：

- 不需要输入完整路径。
- 访问越多的目录权重越高。
- 对多项目开发很方便。

初始化配置：

```shell
# zsh
eval "$(zoxide init zsh)"
```

常见操作：

```shell
# 跳转到路径中包含 blog 的常用目录
z blog

# 多关键词匹配
z workspace hexo

# 交互选择目录
zi blog
```

可以设置别名替代 `cd`：

```shell
alias cd='z'
```

### zellij

`zellij` 是终端复用工具，功能类似 `tmux`，可以在一个终端窗口中管理多个 pane、tab 和 session。

好处：

- 适合同时运行编辑器、服务、日志、测试命令。
- session 可以保持，断开后再恢复。
- 默认界面提示比 `tmux` 更友好。

常见操作：

```shell
# 启动
zellij

# 创建指定 session
zellij -s blog

# 列出 session
zellij list-sessions

# 连接已有 session
zellij attach blog
```

常用快捷键以 `Ctrl + p`、`Ctrl + t`、`Ctrl + n` 等模式键为入口，具体可以在底部状态栏查看提示。

### zsh-autosuggestions

`zsh-autosuggestions` 会根据历史命令给出灰色自动补全建议，类似 Fish Shell 的体验。

好处：

- 常用长命令不用重复输入。
- 对 Git、Docker、npm、brew 等命令很有帮助。

常见配置方式是在 `~/.zshrc` 中加载插件：

```shell
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```

使用时按右方向键或 `Ctrl + e` 接受建议。

### zsh-syntax-highlighting

`zsh-syntax-highlighting` 会在输入命令时进行语法高亮，正确命令和错误命令会用不同颜色显示。

好处：

- 命令还没执行前就能发现拼写问题。
- 路径、字符串、管道等结构更容易辨认。

常见配置方式：

```shell
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

通常建议把它放在 `~/.zshrc` 的最后加载。


## 网络和传输工具

### httpie

`httpie` 的命令通常是 `http`，可以替代部分 `curl` 使用场景，用更自然的方式发送 HTTP 请求。

好处：

- 输出自动格式化 JSON。
- 请求参数写法更接近人类阅读习惯。
- 适合调试 API。

常见操作：

```shell
# GET 请求
http https://httpbin.org/get

# POST JSON
http POST https://httpbin.org/post name=chen age:=18

# 添加 Header
http https://httpbin.org/get Authorization:'Bearer token'

# 查看详细请求和响应
http -v https://httpbin.org/get
```

### telnet

`telnet` 现在较少用于远程登录，更多用于测试 TCP 端口是否连通。

替代工具包括 `nc`、`curl`、`nmap`，但 `telnet host port` 仍然简单直接。

常见操作：

```shell
# 测试端口连通性
telnet example.com 80

# 测试本地服务端口
telnet 127.0.0.1 8080
```

### lrzsz

`lrzsz` 提供 `rz` 和 `sz` 命令，用于通过 ZMODEM 协议上传和下载文件。它常见于 SSH 终端工具配合远程服务器传文件的场景。

常见操作：

```shell
# 从本地上传文件到远程服务器
rz

# 从远程服务器下载文件到本地
sz filename.zip
```

注意：并不是所有终端都支持 ZMODEM。iTerm2 等终端通常需要额外配置触发脚本，或者改用 `scp`、`rsync`、`sftp`。


## 媒体和文件信息

### ffmpeg

`ffmpeg` 是音视频处理工具，可以转码、压缩、裁剪、抽取音频、截取封面、合并文件等。

好处：

- 功能非常全面，是很多视频软件背后的基础工具。
- 适合批量处理媒体文件。
- 命令行可复现，方便写脚本。

常见操作：

```shell
# 查看媒体信息
ffmpeg -i input.mp4

# 转换格式
ffmpeg -i input.mov output.mp4

# 压缩视频
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4

# 提取音频
ffmpeg -i input.mp4 -vn output.mp3

# 截取片段
ffmpeg -ss 00:01:00 -to 00:02:00 -i input.mp4 -c copy clip.mp4

# 从视频中截一张图
ffmpeg -ss 00:00:05 -i input.mp4 -frames:v 1 cover.jpg
```

### exiftool

`exiftool` 用于查看和修改图片、音频、视频、PDF 等文件的元数据，比如拍摄时间、相机型号、GPS、作者信息等。

好处：

- 支持的格式多。
- 适合照片整理、隐私清理、批量改元数据。

常见操作：

```shell
# 查看文件元数据
exiftool photo.jpg

# 查看拍摄时间
exiftool -DateTimeOriginal photo.jpg

# 删除全部元数据
exiftool -all= photo.jpg

# 批量删除当前目录 jpg 元数据
exiftool -all= *.jpg

# 修改拍摄时间
exiftool -DateTimeOriginal="2026:07:10 10:00:00" photo.jpg
```

`exiftool` 默认会生成 `_original` 备份文件，如果确认不需要备份，可以使用 `-overwrite_original`。

## 帮助文档

### tldr

`tldr` 是 `man` 的简化替代品，提供更短、更实用的命令示例。

好处：

- 比 `man` 更适合快速查用法。
- 示例优先，容易复制修改。
- 对不常用命令很有帮助。

常见操作：

```shell
# 查看命令示例
tldr tar

# 更新本地缓存
tldr --update

# 查看中文页面，如果客户端支持
tldr -L zh tar
```

## 推荐组合

这些工具单独使用已经很方便，组合起来效果更明显。

### 搜索文件并查看内容

```shell
bat "$(fd 'README.md' | fzf)"
```

### 搜索文本并打开文件

```shell
rg -l "TODO" | fzf
```

### 找出大目录并清理

```shell
dust -d 2 ~/Downloads
ncdu ~/Downloads
```

### 查看项目概况

```shell
eza -la --git
tree -L 2 -I 'node_modules|.git'
```

### API 调试

```shell
http -v POST http://localhost:3000/api/login username=admin password=123456
```

## 总结

这批工具大致可以分成几类：

- `bat`、`eza`、`fd`、`ripgrep`、`tree` 提升文件查看和搜索效率。
- `btop`、`duf`、`dust`、`ncdu`、`fastfetch` 帮助查看系统和磁盘状态。
- `fzf`、`zoxide`、`zellij`、`zsh-autosuggestions`、`zsh-syntax-highlighting` 提升终端交互体验。
- `httpie`、`telnet`、`lrzsz` 面向网络调试和文件传输。
- `ffmpeg`、`exiftool` 面向媒体处理和文件元数据。
- `tldr` 用来快速查命令示例。

如果只想优先熟悉一部分，建议先从 `eza`、`fd`、`rg`、`bat`、`fzf`、`zoxide` 开始。这几项对日常开发和终端使用的提升最明显。
