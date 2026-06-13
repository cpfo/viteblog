---
title: MySQL 索引与查询优化
categories: [技术]
tags: [mysql,索引,优化]
date: 2026-06-13
---

# MySQL 索引与查询优化

## 索引类型

| 类型 | 说明 |
|------|------|
| PRIMARY KEY | 主键索引，唯一且非空 |
| UNIQUE | 唯一索引 |
| INDEX | 普通索引 |
| FULLTEXT | 全文索引 |
| 组合索引 | 多列组合索引，遵循最左前缀原则 |

## 创建索引

```sql
-- 普通索引
CREATE INDEX idx_name ON user(name);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON user(email);

-- 组合索引
CREATE INDEX idx_name_age ON user(name, age);

-- 查看索引
SHOW INDEX FROM user;
```

## EXPLAIN 分析

```sql
EXPLAIN SELECT * FROM user WHERE name = '张三';
```

重点关注列：
- **type** — const > ref > range > index > ALL（全表扫描）
- **key** — 实际使用的索引
- **rows** — 扫描行数，越少越好
- **Extra** — Using index（覆盖索引）、Using filesort（需要优化）

## 慢查询优化思路

1. **开启慢查询日志**
   ```sql
   SET GLOBAL slow_query_log = ON;
   SET GLOBAL long_query_time = 1;
   ```

2. **常见优化手段**
   - 为 WHERE、ORDER BY、JOIN 的列建立索引
   - 避免 SELECT *，只查需要的列
   - 避免在索引列上使用函数
   - 避免前导模糊匹配：LIKE '%abc' 不走索引
   - 使用 EXPLAIN 分析执行计划
   - 大分页优化：用游标代替 OFFSET

## 索引失效场景

- 对索引列使用函数或计算
- 隐式类型转换
- 组合索引未遵循最左前缀
- OR 条件中有非索引列
- !=、NOT IN、IS NOT NULL 可能不走索引
