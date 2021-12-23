## MySQL：关系型数据库
> 所谓的"关系型"可以理解为"表格"的概念
### 术语
1. 数据库: 数据库是一些关联表的集合。
2. 数据表: 表是数据的矩阵。在一个数据库中的表看起来像一个简单的电子表格。
3. 列: 一列(数据元素) 包含了相同类型的数据, 例如邮政编码的数据。
4. 行：一行（=元组，或记录）是一组相关的数据，例如一条用户订阅的数据。
5. 冗余：存储两倍数据，冗余降低了性能，但提高了数据的安全性。
6. 主键：主键是唯一的。一个数据表中只能包含一个主键。你可以使用主键来查询数据。
7. 外键：外键用于关联两个表。
8. 复合键：复合键（组合键）将多个列作为一个索引键，一般用于复合索引。
9. 索引：使用索引可快速访问数据库表中的特定信息。索引是对数据库表中一列或多列的值进行排序的一种结构。类似于书籍的目录。
10. 参照完整性: 参照的完整性要求关系中不允许引用不存在的实体。与实体完整性是关系模型必须满足的完整性约束条件，目的是保证数据的一致性。

### 常用语句
#### 增
```shell
# 插入数据
INSERT INTO tb_name VALUES ('Gates', 'Bill', 'ACC', 'Beijing');

# 插入指定列的数据
INSERT INTO tb_name (tb_field1, tb_field2) VALUES ('Gates', 'Bill');
```

#### 删
```shell
# 删除一个记录
DELETE FROM tb_name WHERE name = 'Bill';

# 删除所有行
DELETE FROM tb_name;

# 删除表
DROP TABLE tb_name;

# 删除数据库
DROP DATABASE db_name;

# 删除索引
ALTER TABLE tb_name DROP INDEX [索引名称];

# 删除列
ALTER TABLE tb_name  DROP COLUMN column_name;
```

#### 改
```shell
# 数据修改
UPDATE tb_name SET tb_field1 = 'One', tb_field2 = 'Two' WHERE tb_field3 = '111';

# 属性修改

# 添加列
ALTER TABLE tb_name ADD COLUMN state ENUM('1','0') NOT NULL DEFAULT '1';

# 添加唯一約束
ALTER TABLE tb_name ADD UNIQUE (name);
CREATE UNIQUE INDEX [索引名称] ON tb_name(tb_field);

# 更改列属性
ALTER TABLE tb_name MODIFY COLUMN tb_field VARCHAR(50);

# 更改列名
ALTER TABLE tb_name RNAME COLUMN tb_fieldA to tb_fieldB;
ALTER TABLE tb_name CHANGE tb_fieldA tb_fieldB varchar(255);
```

#### 查
```shell
# 基本查询
SELECT * FROM tb_name;
SELECT * FROM tb_name WHERE id = XXX;

# 多条查询
SELECT * FROM tb_name WHERE id in (xx, xx);

# 查询记录总数
SELECT count(*) FROM tb_name;

# 查询前十条数据
SELECT * FROM tb_name LIMIT 10;
```