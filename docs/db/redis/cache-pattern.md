---
title: Redis 缓存应用模式
categories: [技术]
tags: [redis,缓存,分布式]
date: 2026-06-13
---

# Redis 缓存应用模式

## 缓存读写模式

### Cache Aside（旁路缓存）

读：先查缓存 → 命中则返回，未命中则查 DB → 写入缓存 → 返回
写：先更新 DB → 再删除缓存

```bash
GET user:1
SET user:1 "{...}" EX 3600
DEL user:1
```

### 为什么不更新缓存而是删除？

并发写时更新缓存会导致数据不一致。删除缓存后，下次读会重新加载，保证最终一致性。

## 缓存问题及解决方案

### 缓存穿透

查询一个不存在的数据，缓存和 DB 都没有，请求直接打到 DB。

**解决：**
- 缓存空值，设置短过期时间
- 布隆过滤器：拦截不存在 key 的请求

### 缓存击穿

热点 key 过期，大量并发请求同时打到 DB。

**解决：**
- 互斥锁（分布式锁）
- 逻辑过期，后台异步刷新

### 缓存雪崩

大量 key 同时过期，或 Redis 宕机。

**解决：**
- 过期时间加随机值
- 多级缓存：本地缓存 + Redis
- 限流降级
- Redis 高可用：主从 + 哨兵 / Cluster

## 分布式锁

```bash
SET lock:order:1001 uuid_value NX EX 30
```

## 常见场景

| 场景 | 数据结构 | 说明 |
|------|---------|------|
| 计数器 | String | INCR 实现点赞、访问量 |
| 排行榜 | Sorted Set | ZREVRANGE 获取 Top N |
| 消息队列 | List | LPUSH + BRPOP |
| 去重 | Set | SADD 实现 UV 统计 |
| 用户 Session | String + TTL | 分布式 Session |
| 限流 | String + TTL | INCR + EXPIRE 滑动窗口 |
