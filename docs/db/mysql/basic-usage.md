---
title: MySQL 基本使用
categories: [技术]
tags: [mysql,数据库]
date: 2026-06-13
---

# MySQL 基本使用

## 建表

```sql
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 增删改查

```sql
-- 插入
INSERT INTO user (name, email, age) VALUES ('张三', 'zhangsan@example.com', 25);

-- 查询
SELECT * FROM user WHERE age > 20 ORDER BY created_at DESC LIMIT 10;

-- 更新
UPDATE user SET age = 26 WHERE name = '张三';

-- 删除
DELETE FROM user WHERE id = 1;
```

## 常用查询

### 聚合查询

```sql
SELECT age, COUNT(*) AS cnt FROM user GROUP BY age HAVING cnt > 1;
```

### 连表查询

```sql
SELECT u.name, o.order_no
FROM user u
JOIN order o ON u.id = o.user_id
WHERE u.age > 18;
```

### 分页查询

```sql
SELECT * FROM user ORDER BY id LIMIT 20 OFFSET 0;   -- 第一页
SELECT * FROM user ORDER BY id LIMIT 20 OFFSET 20;  -- 第二页
```

## 常用函数

- NOW() — 当前时间
- COUNT() / SUM() / AVG() / MAX() / MIN() — 聚合函数
- DATE_FORMAT(date, '%Y-%m-%d') — 日期格式化
- IFNULL(expr, default) — 空值处理
- CONCAT(a, b) — 字符串拼接
