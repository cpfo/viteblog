---
title: Redis 基本使用
categories: [技术]
tags: [redis,缓存]
date: 2026-06-13
---

# Redis 基本使用

## 常用数据结构

### String

```bash
SET key value
GET key
SETNX key value
INCR key
EXPIRE key 60
TTL key
```

### Hash

```bash
HSET user:1 name "张三" age 25
HGET user:1 name
HGETALL user:1
HINCRBY user:1 age 1
```

### List

```bash
LPUSH queue task1
RPUSH queue task2
LPOP queue
LLEN queue
LRANGE queue 0 -1
```

### Set

```bash
SADD tags java python
SMEMBERS tags
SISMEMBER tags java
SINTER set1 set2
SUNION set1 set2
```

### Sorted Set

```bash
ZADD ranking 100 "张三" 85 "李四"
ZRANGE ranking 0 -1 WITHSCORES
ZREVRANGE ranking 0 2
ZINCRBY ranking 10 "张三"
```

### HyperLogLog

基数统计（去重计数），标准误差约 0.81%，每个 key 固定占用 12KB。

```bash
PFADD visitors user1 user2 user3   # 添加元素
PFCOUNT visitors                   # 返回基数估算值 ≈ 3
PFMERGE total visitors1 visitors2  # 合并多个 HyperLogLog
```

## 通用命令

```bash
KEYS *
SCAN 0 MATCH user:*
TYPE key
DEL key
EXISTS key
```