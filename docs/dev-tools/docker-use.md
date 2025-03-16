---
title: docker的安装和使用
categories: [开发工具]
tags: [docker]
date: 2025-03-16 17:20:02
---
## 安装

### 安装 `yum-utils` 包

（提供 `yum-config-manager` 实用工具），并设置 Docker 的稳定存储库

```bash
yum install -y yum-utils 
sudo yum-config-manager \ --add-repo \ https://download.docker.com/linux/centos/docker-ce.repo
# 或者使用阿里云的源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

```

### 安装docker

> yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

### 启动docker

启动docker， 并设置为开机启动

```bash
sudo systemctl start docker 
sudo systemctl enable docker
```

### 验证安装

> sudo docker run hello-world

若输出`Hello from Docker!` 则安装成功

## 更换镜像源, 加速下载

* **创建配置文件**

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.m.daocloud.io",
    "https://registry.docker-cn.com"
  ]
}
EOF
```

* **重新加载配置**

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

* **验证是否生效**

```bash
docker info | grep "Registry Mirrors" -A 10
```

若显示配置的镜像地址，则加速成功

## 制作docker镜像

### python镜像

下面以制作一个包含python环境的镜像，并启动fastapi服务。

**创建项目目录和文件**

新建一个项目目录 `py312`, 然后在该目录下创建 `Dockerfile` 和 `requirements.txt` 文件

**修改 `requirements.txt` 文件**

在 `requirements.txt` 文件里列出你想要安装的 `pip` 包及其版本（如果有版本要求的话）

```bash
fastapi 
uvicorn
numpy 
pandas
```

**编写 `Dockerfile` 文件**

`Dockerfile` 文件用于定义如何构建 Docker 镜像

```dockerfile
# 使用官方 Python 基础镜像，这里以 Python 3.12 为例
FROM python:3.12

# 设置工作目录
WORKDIR /app

# 复制 requirements.txt 文件到工作目录
COPY requirements.txt .

# 安装 pip 包
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目文件到工作目录（如果有项目代码的话）
COPY . .

# 暴露端口（如果应用需要监听端口）
EXPOSE 8000

# 定义容器启动时执行的命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```

**添加main.py文件**

```python
from fastapi import FastAPI

# 创建 FastAPI 应用实例
app = FastAPI()

# 定义首页接口
@app.get("/")
def read_root():
    return {"Hello": "World"}
    
```

**解释**

-   `FROM python:3.12`：指定使用官方的 Python 3.12 镜像作为基础镜像。
-   `WORKDIR /app`：设定工作目录为 `/app`，后续的操作都会在这个目录下进行。
-   `COPY requirements.txt .`：把当前目录下的 `requirements.txt` 文件复制到工作目录。
-   `RUN pip install --no-cache-dir -r requirements.txt`：在容器内执行 `pip` 命令来安装 `requirements.txt` 里列出的所有包，`--no-cache-dir` 选项可避免缓存占用过多空间。
-   `COPY . .`：将当前目录下的所有文件复制到工作目录。
-   `EXPOSE 8000`：声明容器会监听 8000 端口（依据实际应用的端口进行调整）。
-   `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`：定义容器启动时要执行的命令，这里假设使用 `uvicorn` 来运行一个名为 `main` 的 FastAPI 应用。

**构建docker镜像**

在 `py312` 目录下执行下面命令来构建镜像。

```bash
docker build -t py312-image  .
```

其中，`-t py312-image` 为镜像指定了一个标签，你可以根据需求修改这个标签；`.` 表示使用当前目录作为构建上下文。

**运行docker容器**

```bash
docker run -d -p 8000:8000 py312-image
```

-   `-d`：让容器在后台运行（守护模式）。
-   `-p 8000:8000`：将主机的 8000 端口映射到容器的 8000 端口，这样就能通过主机的 8000 端口访问容器内的应用。
-   `py312-image`：指定要使用的镜像。




## 常用命令


### 一、基础命令

1. **查看 Docker 信息**

* docker version：显示 Docker 版本信息。
* docker info：查看 Docker 系统级信息（镜像、容器、存储等）。
* docker system df：统计镜像、容器、数据卷的磁盘占用。

2. **服务管理**

* systemctl start/stop/restart docker：启动/停止/重启 Docker 服务。
* systemctl enable docker：设置 Docker 开机自启。

### 二、镜像管理

**镜像操作**

* docker images：列出本地所有镜像。
* docker pull <镜像名:标签>：从仓库拉取镜像（默认 latest 标签）。
* docker rmi <镜像ID>：删除指定镜像（需先停止相关容器）。
* docker build -t <镜像名> .：根据当前目录的 Dockerfile 构建镜像。

**镜像导出与导入**

* docker save -o <文件名.tar> <镜像名>：将镜像打包为 .tar 文件。
* docker load -i <文件名.tar>：从文件导入镜像。

### 三、容器操作

**容器生命周期**

* docker run -d -p <主机端口>:<容器端口> --name <容器名> <镜像>：后台启动容器并映射端口。
	* -d：后台运行；-it：交互式终端；--rm：容器退出后自动删除。
* docker start/stop/restart <容器名>：启动/停止/重启容器。
* docker rm <容器名>：删除已停止的容器（加 -f 强制删除运行中的容器）。

**容器交互与调试**

* docker exec -it <容器名> /bin/bash：进入容器终端。
* docker logs <容器名>：查看容器日志（加 -f 实时追踪）。
* docker inspect <容器名>：查看容器详细信息（网络、配置等）。

**状态监控**

* docker ps：列出运行中的容器（加 -a 显示所有容器）。
* docker stats：实时监控容器资源占用（CPU、内存）。

### 四、网络与数据卷

**网络管理**

* docker network ls：列出所有 Docker 网络。
* docker network create <网络名>：创建自定义网络。
* docker network connect <网络名> <容器名>：将容器加入指定网络。

**数据卷操作**

* docker volume ls：列出所有数据卷。
* docker run -v <主机目录>:<容器目录>：挂载主机目录到容器。
* docker volume prune：清理未使用的数据卷。

### 五、其他实用命令
* docker commit <容器名> <新镜像名>：将容器保存为新镜像。
* docker cp <容器名>:<容器路径> <主机路径>：在容器与主机间复制文件。
* docker system prune：一键清理未使用的镜像、容器、网络。

### 附：Docker Compose 常用命令
* docker-compose up -d：启动所有服务（后台模式）。
* docker-compose down：停止并删除所有服务。
* docker-compose logs <服务名>：查看指定服务的日志。