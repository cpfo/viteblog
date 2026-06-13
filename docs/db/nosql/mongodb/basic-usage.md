---
title: MongoDB 基本使用
categories: [技术]
tags: [mongodb,数据库]
date: 2026-06-13
---

# MongoDB 基本使用

## 数据库与集合

```js
use mydb
db.createCollection('users')
show collections
```

## 增删改查

```js
// 插入
db.users.insertOne({ name: '张三', age: 25, email: 'zhangsan@example.com' })
db.users.insertMany([
  { name: '李四', age: 30 },
  { name: '王五', age: 22 }
])

// 查询
db.users.find()
db.users.find({ age: { $gt: 25 } })
db.users.find({ name: /张/ })
db.users.find().sort({ age: -1 }).limit(10)

// 更新
db.users.updateOne({ name: '张三' }, { $set: { age: 26 } })
db.users.updateMany({ age: { $lt: 20 } }, { $set: { status: 'minor' } })

// 删除
db.users.deleteOne({ name: '张三' })
db.users.deleteMany({ status: 'inactive' })
```

## 常用查询操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| $gt / $gte | 大于 / 大于等于 | { age: { $gt: 25 } } |
| $lt / $lte | 小于 / 小于等于 | { age: { $lt: 60 } } |
| $in / $nin | 包含 / 不包含 | { status: { $in: ['A','B'] } } |
| $exists | 字段是否存在 | { email: { $exists: true } } |
| $regex | 正则匹配 | { name: { $regex: /^张/ } } |
| $and / $or | 逻辑运算 | { $or: [{age: 25}, {name: '李四'}] } |

## 索引

```js
db.users.createIndex({ name: 1 })
db.users.createIndex({ age: -1 })
db.users.createIndex({ name: 1, age: -1 })
db.users.getIndexes()
db.users.find({ name: '张三' }).explain('executionStats')
```