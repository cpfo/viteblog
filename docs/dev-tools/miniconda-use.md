---
title: miniconda的使用
categories: [开发工具]
tags: [miniconda]
date: 2025-03-16 17:20:02
---

## 使用时常用的命令记录

### 环境管理

**创建新的环境**
创建新环境，并制定python版本

```bash
conda create -n py312 python=3.12
```

**查看环境**

> conda env remove -n myenv

**激活环境**

> conda activate myenv

**停用环境**

> conda deactivate

**删除环境**

> conda env remove -n py312

### 包管理

**安装包**

```bash
conda install requests
# 指定版本安装
conda install requests=x.x.x
```

**列出已安装的包**

> conda list

**删除已安装的包**

> conda remove requests


### 配置管理

**查看配置**

> conda config --show

**修改镜像加速**

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
```

**设置打开powershell时默认不进入conda的base环境**

安装后，打开powershell，默认进入base环境，速度慢，关闭掉自动进入的配置

> conda config --set auto_activate_base false

**修改env的安装路径**

```bash

# 查看配置

config info


#修改配置

conda config --remove envs_dirs newdir #删除环境路径newdir
conda config --remove pkgs_dirs newdir #删除缓存路径newdir

conda config --add envs_dirs dir#添加环境路径newdir
conda config --add pkgs_dirs dir#添加缓存路径newdir

```

conda info 结果,  `package cache`  和  `envs directories` 中可以看到修改后的地址

```bash

     active environment : p
    active env location : D
            shell level : 1
       user config file : C
 populated config files : D
                          C
          conda version : 2
    conda-build version : n
         python version : 3
                 solver : l
       virtual packages : _
                          _
                          _
       base environment : D
      conda av data dir : D
  conda av metadata url : N
           channel URLs : h
                          h
                          h
                          h
                          h
                          h
                          h
                          h
                          h
                          h
          package cache : D
       envs directories : D
                          C
                          D
                          C
               platform : w
             user-agent : c
          administrator : F
             netrc file : N
           offline mode : F
```
