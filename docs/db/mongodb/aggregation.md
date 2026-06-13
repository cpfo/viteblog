---
title: MongoDB 聚合管道
categories: [技术]
tags: [mongodb,聚合]
date: 2026-06-13
---

# MongoDB 聚合管道

## 管道阶段

```js
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$category', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])
```

## 常用阶段

| 阶段 | 说明 |
|------|------|
| $match | 过滤文档，类似 WHERE |
| $group | 分组聚合 |
| $sort | 排序 |
| $limit / $skip | 分页 |
| $project | 字段投影/重塑 |
| $unwind | 数组展开 |
| $lookup | 左外连接（类似 JOIN） |
| $addFields | 添加新字段 |

## 示例

### 按分类统计销售额

```js
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $sort: { totalAmount: -1 } }
])
```

### 连表查询

```js
db.orders.aggregate([
  { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'userInfo'
  }},
  { $unwind: '$userInfo' },
  { $project: { orderNo: 1, 'userInfo.name': 1, amount: 1 } }
])
```

### 数组展开与统计

```js
db.articles.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```