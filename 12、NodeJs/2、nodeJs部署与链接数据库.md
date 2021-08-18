## 一、怎么链接数据库

1. 引入mongodb模块
2. 定义数据库地址
3. .connect 链接数据库



```js
var MongoClient = require('mongodb').MongoClient;//引入mongodb
var url = 'mongodb://localhost:27017/MENU_DATA';//mongodb的数据库地址
 
MongoClient.connect(url, function (err, db) {//连接数据库
  if (err) throw err;
  console.log("数据库已创建!");
  db.close();
})
```



## 二、 怎么部署到服务器

1. 安装node npm，mongodb
2. 链接数据库
3. 

