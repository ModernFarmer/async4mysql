*本模块是将node-mysql模块进行简单封装, 旨在更加简单直观地进行同步操作异步调用或异步操作异步调用, 本模块的相关参数设定完全遵循node-mysql模块的相关设定.*
　<br><br><br>
*This module is a simple encapsulation of node-mysql module, aiming to make asynchronous invocation of synchronous operation or asynchronous operation and asynchronous invocation more simple and intuitive. The parameter setting of this module fully follows the relevant setting of node-mysql module.*
**The English API is at the back of the page!**<br><br><br>
**下载:**

```javascript
npm install async4mysql -S
```

**引入:**

```javascript
const async4mysql = require('async4mysql');      //引入async4mysql模块

const db = new async4mysql(option);      //创建模块实例对象
```
* `new async4mysql对象`会根据 `参数类型` 来创建一个 **单一连接池** 或者 **连接池集群**

**使用:**

**　单一连接池 \-\>**

```javascript
当 new async4mysql(option) 的 option参数 是一个json, 那么 new async4mysql(option) 
将会创建一个 单一连接池(由mysql模块的.createPool()方法创建的只包含一个连接的连接池).

参数格式:
  {
    host:'localhost',           // 数据库服务器名称
    user:'root',                // 数据库服务器用户名
    port:3306,                  // 数据库服务器接口
    password:'123456',          // 数据库服务器密码
    database:'damo'             // 要连接的数据库名称
  }
```
\>\>\>\>\>　当**db对象**是一个**单一连接池**时, **db对象** 可以使用以下6个方法:<br>
> * `.select()`,　`.delete()`,　`.update()`,　`.insert()`,　`.entire()`,　`.query()`

**1:　.select()方法**

**.select()　　同步执行指定的mysql 查询语句 ( SELECT语句 )**

　参数 :<br>
　　**.select**( *sql*,　*arr* )<br>
　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {      //参数option是一个json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* 由于参数option是一个json, async4mysql
　　　　　　　　　　　　　　　　　　　　　实例将会创建一个 单一连接池 */

let sql_1 = `SELECT * FROM table`;

db.select(sql_1).then(data => {      /*select()方法的.then()方法的回调函数参数
　　　　　　　　　　　　　　　　　　　data即为sql_1语句的查询结果, 是一个 数组*/
  console.log(data);      // [{id:'123', value1:'aaa', value2:'bbb'}, {id:'456', value1:'ccc', value2:'ddd'}, ......]　
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

db.select(sql_2, ['table', 'myTablesId']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT * FROM table`;

  let result_1 = await db.select(sql_1).catch(err => {     //在async函数中使用.select方法, 将直接返回sql_1语句的查询结果result_1　　
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

  let result_2 = await db.select(sql_2, ['table', 'myTablesId']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**2:　.delete()方法**

**.delete()　　同步执行指定的mysql 删除语句 ( DELETE语句 )**

　参数 :<br>
　　**.delete**( *sql*,　*arr* )<br>
　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {      //参数option是一个json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* 由于参数option是一个json, async4mysql
　　　　　　　　　　　　　　　　　　　　　　实例将会创建一个 单一连接池 */

let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

db.delete(sql_1).then(data => {  // .delete()方法的.then()方法的回调函数参数data是sql_1语句的删除结果描述, 是一个 字符串　
  console.log(data);      //  `--->  *async4mysql*模块: DELETE FROM table WHERE id='123456'   --->  语句已执行!`　
　　　　　　　　　　　　　// ***一般情况下不需要.delete()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

db.delete(sql_2, ['table', '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

  await db.delete(sql_1).catch(err => {     //在async函数中使用.delete方法, 无需db对象的返回值
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***　
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

  await db.delete(sql_2, ['table', '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**3:　.update()方法**

**.update()　　同步执行指定的mysql 更新语句 ( UPDATE语句 )**

　参数 :<br>
　　**.update**( *sql*,　*arr* )<br>
　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {      //参数option是一个json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* 由于参数option是一个json, async4mysql
　　　　　　　　　　　　　　　　　　　　　　实例将会创建一个 单一连接池 */

let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

db.update(sql_1).then(data => {  // .update()方法的.then()方法的回调函数参数data是sql_1语句的更新结果描述, 是一个 字符串
  console.log(data);      //  `--->  *async4mysql*模块: UPDATE table SET value1='aaa' WHERE id='123456'   --->  语句已执行!`　　
　　　　　　　　　　　　　// ***一般情况下不需要.update()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

db.update(sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

  let result_1 = await db.update(sql_1).catch(err => {     //在async函数中使用.update方法, 无需db对象的返回值　
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

  await db.update(sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**4:　.insert()方法**

**.insert()　　同步执行指定的mysql 插入语句 ( INSERT语句 )**

　参数 :<br>
　　**.insert**( *sql*,　*arr* )<br><br>
　　如果 *sql* 的类型是 *字符串* :<br>
　　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　　`arr:　防注入操作存放数据的数组　　　　可选`<br><br>
　　如果 *sql* 的类型是 *json* :<br>
　　　`sql:　要执行的mysql语句的 插入内容键值对(json)　　必须`<br>
　　　`arr:　需要操作的数据表的 表名字符串　　　　　　　　必须`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {                        //参数option是一个json
  host:'localhost',
  user:'root',
  port:3306,
  password:'123456',
  database:'damo'
};

const db = new async4mysql(option);     //*由于参数option是一个json, async4mysql实例将会创建一个 单一连接池

let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

db.insert(sql_1).then(data => {       //.insert()方法的.then()方法的回调函数参数data是sql_1语句的插入结果描述, 是一个 字符串　
  console.log(data);        //  `--->  *async4mysql*模块: INSERT INTO table SET id='aaa',value1='bbb'   --->  语句已执行!`　
　　　　　　　　　　　　　　// ***一般情况下不需要.insert()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `INSERT INTO ?? SET ?`;

db.insert(sql_2, ['table', {id:'aaa', value1:'bbb'}]).then(data=>{
  // todo...
}).catch(err => {
  // todo...
});

let json = {id:'eee', value:'fff'};

db.insert(json, 'table').then(data => {    // 相当于db.insert(`INSERT INTO ?? SET ?`, ['table', json]).then( ......　
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

  await db.insert(sql_1).catch(err=>{     //在async函数中使用.insert方法, 将直接执行插入语句, 一般不需要它的返回值　
    console.log(err);
  });
    //*await操作符可以同步执行异步async函数, 因此只有在sql_1执行完毕之后才会执行后面的一系列操作

  console.log(db.sql);      /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `INSERT INTO ?? SET ?`;

  await db.insert(sql_2, ['table', {id:'aaa', value1:'bbb'}]).catch(err=>{
    // todo...
  });

  console.log(db.sql);

  let json = {id:'eee', value:'fff'};

  await db.insert(json, 'table').catch(err => {    //相当于db.insert(`INSERT INTO ?? SET ?`, ['table', json]).catch( ......　
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**5:　.entire()方法**

**.entire()　　* 可以异步执行 多个mysql操作, 并保证所有 mysql操作 都执行完毕后, 才返回相关数据**

*参数*:<br>
```javascript
.entire(
  {sql : '...',  values : [] },
  {sql : '...',  values : [] },
    ......
)
```
* .entire()方法的*参数类型*必须是 **json**, 可以有 **大于1的任意** 个 *参数*
```javascript
{
  sql:  要执行的mysql语句 或者 INSERT语句的键值对        (必须)
  values:  防注入操作存放数据的数组 [可选] 或者 INSERT操作的表名称字符串 (必须)
}
```
**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {                    // 参数option是一个json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);     // *由于参数option是一个json, async4mysql实例将会创建一个 单一连接池　

let P1 = {
  sql:`SELECT * FROM table WHERE value = 'value1'`,
  // values:[]            // *当不需要进行防注入操作时, values属性可以省略
};

let P2 = {
  sql:`INSERT INTO ?? SET id = ?, value = ?`,
  values:['table', 'id', 'value']
};

let P3 = {
  sql:{id:'_id', value:'_value'},      // *** 当sql属性的类型为json时, 即代表该操作**一定**为 INSERT操作
  values:'table'      // *** 当sql属性的类型为json时, values属性不能省略, 且它的类型必须是 字符串 , 它表示INSERT操作的表名称　
};

/* P3写法相当于:
  let P3 = {
    sql:`INSERT INTO ?? SET ?`,
    values: ['table', {id:'_id', value:'_value'}]
  }; */

db.entire(P1, P2, P3).then(data => {       /* .insert()方法的.then()方法的回调函数参数data是一个 数组,
　　　　　　　　　　　　　　　　　　　　　　　　该数组会在P1、P2、P3都执行完毕后才会被返回,
　　　　　　　　　　　　　　　　　　　　　　　　该数组按照参数 P1, P2, P3的顺序 装有所有 mysql语句 的执行结果 */
　　　　　　// *** .entire()方法中, P1, P2, P3是异步执行的, 也就是说P1, P2, P3是同时执行的, 无需等P1完成后再执行P2和P3　
  console.log(data);    // [[{id:'aaa', value:'bbb'}], '...语句用已执行 !', '...语句用已执行 !']
　　　　　　// *** 只有SELECT相关操作的结果类型是数组, DELETE、UPDATE和INSERT操作的结果都是字符串
  console.log(db.sql);  /* *** .entire()方法的 db.sql属性 代表包含本次操作的所有 mysql语句 的 数组;
　　　　　　　　　　　　　　　*!* 如果在执行过程中出现错误, 那么db.sql属性将是 db实例抛出的错误信息
　　　　　　　　　　　　　　　db.sql属性的顺序与参数 P1, P2, P3的顺序完全一致;
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);  // 如果在执行过程中出现错误, 此时的db.sql属性是 db实例抛出的错误信息
   //错误信息格式: * _______________async4mysql模块 .entire()方法 错误* sql语句执行出错, ---> sql: (这里是出错的sql语句)}　
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let P1 = {
    sql:`SELECT * FROM table WHERE value = 'value1'`,
    // values:[]            // *当不需要进行防注入操作时, values属性可以省略
  };

  let P2 = {
    sql:`INSERT INTO ?? SET id = ?, value = ?`,
    values:['table', 'id', 'value']
  };

  let P3 = {
    sql:{id:'_id', value:'_value'},       // *** 当sql属性的类型为json时, 即代表该操作为 INSERT操作
    values:'table'                  // *** 当sql属性的类型为json时, values属性不能省略, 且它的类型必须是 字符串 , 它表示INSERT操作的表名称　
  };

  /* P3写法相当于:
    let P3 = {
      sql:`INSERT INTO ?? SET ?`,
      values: ['table', {id:'_id', value:'_value'}]
    }; */

  let result = await db.entire(P1, P2, P3).catch(err => {  /* 当P1、P2、P3都执行完毕后, 返回result, 它是一个数组
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　它按照参数P1, P2, P3的顺序 装有所有 mysql语句 的执行结果 */
    console.log(err);
    console.log(db.sql);  // 如果在执行过程中出现错误, 此时的db.sql属性是 db实例抛出的错误信息
      //错误信息格式: * _______________async4mysql模块 .entire()方法 错误* sql语句执行出错, ---> sql: (这里是出错的sql语句)}
      // todo ...
    });

　　　//*await操作符可以同步执行异步async函数, 因此只有在.entire()方法执行完毕之后才会执行后面的一系列操作

    console.log(db.sql);  /* *** .entire()方法的 db.sql属性 代表包含本次操作的所有 mysql语句的数组;
　　　　　　　　　　　　　　*!* 如果在执行过程中出现错误, 那么db.sql属性将是 db实例抛出的错误信息
　　　　　　　　　　　　　　db.sql属性的顺序与参数 P1, P2, P3的顺序完全一致;
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
    // todo ...

    res.json({ok:true, msg:'Oh! yeah~'});
});
```
**6:　.query()方法**

**.query()　　同步执行指定的 *所有类型mysql语句* ( 一般用于执行*除了* 增、删、改、查 外的mysql语句 )**

　参数 :<br>
　　**.query**( *sql*,　*arr* )<br>
　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option = {                    //参数option是一个json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);     //*由于参数option是一个json, async4mysql实例将会创建一个 单一连接池

let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

db.query(sql_1).then(data => {
  console.log(data);
  console.log(db.sql);
}).catch(err => {
  // todo...
});

let sql_2 = `CREATE TABLE damo (
　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　_int int(2) DEFAULT NULL
　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

db.query(sql_2).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

  let result = await db.query(sql_1).catch(err => {
    // todo...
  });

  console.log(result);
    //*await操作符可以同步执行异步async函数, 因此只有在sql_1执行完毕之后才会执行后面的一系列操作

  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `CREATE TABLE damo (
　　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　　_int int(2) DEFAULT NULL
　　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

  await db.query(sql_2).catch(err => {
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**\-\-\-连接池集群\-\-\-**

```javascript
当 new async4mysql(option) 的 option参数 是一个Array,
那么 new async4mysql(option) 则会创建一个 连接池集群 (由mysql模块
的.createPoolCluster()方法创建的包含一个或多个连接的连接池).

参数格式:
  [
    {
      connectName:'CONNECT_1',    // 连接名称
      option:{
        host:'localhost',            // 数据库服务器名称
        user:'root_1',               // 数据库服务器用户名
        port:3306,                   // 数据库服务器接口
        password:'pwd_1',            // 数据库服务器密码
        database:'damo_1'            // 要连接的数据库名称
      }
    },
    {
      connectName:'CONNECT_2',    // 连接名称
      option:{
        host:'localhost',            // 数据库服务器名称
        user:'root_1',               // 数据库服务器用户名
        port:3306,                   // 数据库服务器接口
        password:'pwd_2',            // 数据库服务器密码
        database:'damo_2'            // 要连接的数据库名称
      }
    },
    ......
  ]
```
**此时, new async4mysql(option)实例 会根据 *参数数组* 中的每一个 *值(json)* 的 `json.option` 来创建相应连接名为 `json.connectName` 的连接**　<br><br>
**连接池集群 可以在 *同一个实例中* 对 *不同* 的 `mysql数据库` 进行操作!!! (单一连接池*只能*对 *同一个mysql数据库* 进行操作)**　<br><br>
\>\>\>\>\>　当**db对象**是一个连接池集群时, **db对象**可以使用以下6个方法:<br>
> * `.$select()`,　`.$delete()`,　`.$update()`,　`.$insert()`,　`.$entire()`,　`.$query()`

**1:　.$select()方法**

**.$select()　　同步执行指定的mysql 查询语句 ( SELECT语句 )**

　参数 :<br>
　　**.$select**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　连接名　　　　　　　　　必须`<br>
　　`sql:　要执行的mysql语句　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作　


let sql_1 = `SELECT * FROM table`;

db.$select('CONNECT_1', sql_1).then(data => {      /*select()方法的.then()方法的回调函数参数
　　　　　　　　　　　　　　　　　　　　　　　　　　　data即为sql_1语句的查询结果, 是一个 数组*/
  console.log(data);      // [{id:'123', value1:'aaa', value2:'bbb'}, {id:'456', value1:'ccc', value2:'ddd'}, ......]
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

db.$select('CONNECT_2', sql_2, ['table', 'myTablesId']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT * FROM table`;

  let result_1 = await db.$select('CONNECT_1', sql_1).catch(err => {     //在async函数中使用.$select方法, 将直接返回sql_1语句的查询结果result_1　
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

  let result_2 = await db.$select('CONNECT_2', sql_2, ['table', 'myTablesId']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**2:　.$delete()方法**

**.$delete()　　同步执行指定的mysql 删除语句 ( DELETE语句 )**

　参数 :<br>
　　**.$delete**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　连接名　　　　　　　　　必须`<br>
　　`sql:　要执行的mysql语句　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作


let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

db.$delete(CONNECT_1, sql_1).then(data => {  // .$delete()方法的.then()方法的回调函数参数data是sql_1语句的删除结果描述, 是一个 字符串　
  console.log(data);      //  `--->  *async4mysql*模块: DELETE FROM table WHERE id='123456'   --->  语句已执行!`
　　　　　　　　　　　　　// ***一般情况下不需要.$delete()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

db.$delete(CONNECT_2, sql_2, ['table', '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

  await db.$delete(CONNECT_1, sql_1).catch(err => {     //在async函数中使用.$delete方法, 无需db对象的返回值　
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

  await db.$delete(CONNECT_2, sql_2, ['table', '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**3:　.$update()方法**

**.$update()　　同步执行指定的mysql 更新语句 ( UPDATE语句 )**

　参数:<br>
　　**.$update**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　连接名　　　　　　　　　必须`<br>
　　`sql:　要执行的mysql语句　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作


let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

db.$update('CONNECT_1', sql_1).then(data => {  // .$update()方法的.then()方法的回调函数参数data是sql_1语句的更新结果描述, 是一个 字符串　
  console.log(data);      //  `--->  *async4mysql*模块: UPDATE table SET value1='aaa' WHERE id='123456'   --->  语句已执行!`　
　　　　　　　　　　　　　// ***一般情况下不需要.$update()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

db.$update('CONNECT_2', sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

  let result_1 = await db.$update('CONNECT_1', sql_1).catch(err => {     //在async函数中使用.$update方法, 无需db对象的返回值　
    console.log(err)
  });
    // ***await操作符可以同步执行异步async函数, 因此只有在result_1返回完毕之后才会执行后面的一系列操作***
  console.log(result_1);
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

  await db.$update('CONNECT_2', sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**4:　.$insert()方法**

**.$insert()　　同步执行指定的mysql 插入语句 ( INSERT语句 )**

　参数 :<br>
　　**.$insert**( *connectName*,　*sql*,　*arr* )<br><br>
　　如果 *sql* 的类型是 *字符串* :<br>
　　　`connectName:　连接名　　　　　　　　　必须`<br>
　　　`sql:　要执行的mysql语句　　　　　　　必须`<br>
　　　`arr:　防注入操作存放数据的数组　　　　可选`<br><br>
　　如果 *sql* 的类型是 *json* :<br>
　　　`connectName:　连接名　　　　　　　　　　　　　　　必须`<br>
　　　`sql:　要执行的mysql语句的 插入内容键值对(json)　　必须`<br>
　　　`arr:　需要操作的数据表的 表名字符串　　　　　　　　必须`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作


let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

db.$insert('CONNECT_1', sql_1).then(data => {       //.$insert()方法的.then()方法的回调函数参数data是sql_1语句的插入结果描述, 是一个 字符串　
  console.log(data);        //  `--->  *async4mysql*模块: INSERT INTO table SET id='aaa',value1='bbb'   --->  语句已执行!`
　　　　　　　　　　　　　　// ***一般情况下不需要.$insert()方法的返回值
  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `INSERT INTO ?? SET ?`;

db.$insert('CONNECT_2', sql_2, ['table', {id:'aaa', value1:'bbb'}]).then(data=>{
  // todo...
}).catch(err => {
  // todo...
});

let json = {id:'eee', value:'fff'};

db.$insert('CONNECT_1', json, 'table').then(data => {    // 相当于db.$insert(`INSERT INTO ?? SET ?`, ['table', json]).then( ......　
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

  await db.$insert('CONNECT_1', sql_1).catch(err=>{     //在async函数中使用.$insert方法, 将直接执行插入语句, 一般不需要它的返回值　
    console.log(err);
  });
    //*await操作符可以同步执行异步async函数, 因此只有在sql_1执行完毕之后才会执行后面的一系列操作

  console.log(db.sql);      /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `INSERT INTO ?? SET ?`;

  await db.$insert('CONNECT_2', sql_2, ['table', {id:'aaa', value1:'bbb'}]).catch(err=>{
    // todo...
  });

  console.log(db.sql);

  let json = {id:'eee', value:'fff'};

  await db.$insert('CONNECT_1', json, 'table').catch(err => {    //相当于db.$insert(`INSERT INTO ?? SET ?`, ['table', json]).catch( ......　　
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**5:　.$entire()方法**

**.$entire()　　* 可以异步执行 多个mysql操作, 并保证所有 mysql操作 都执行完毕后, 才返回相关数据**

*参数*:<br>
```javascript
.$entire(
  {connectName : '...',  sql : '...',  values : [] },
  {connectName : '...',  sql : '...',  values : [] },
    ......
)
```
* .$entire()方法的*参数类型*必须是 **json**, 可以有 **大于1的任意** 个 *参数*
```javascript
{
  connectName:  连接名           (必须)
  sql:  要执行的mysql语句 或者 INSERT语句的键值对        (必须)
  values:  防注入操作存放数据的数组 [可选] 或者 INSERT操作的表名称字符串 (必须)
}
```
**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作　


let P1 = {
  connectName:'CONNECT_1',
  sql:`SELECT * FROM table WHERE value = 'value1'`,
  // values:[]            // *当不需要进行防注入操作时, values属性可以省略
};

let P2 = {
  connectName:'CONNECT_2',
  sql:`INSERT INTO ?? SET id = ?, value = ?`,
  values:['table', 'id', 'value']
};

let P3 = {
  connectName:'CONNECT_1',
  sql:{id:'_id', value:'_value'},      // *** 当sql属性的类型为json时, 即代表该操作**一定**为 INSERT操作
  values:'table'      // *** 当sql属性的类型为json时, values属性不能省略, 且它的类型必须是 字符串 , 它表示INSERT操作的表名称　
};

/* P3写法相当于:
  let P3 = {
    connectName:'CONNECT_1',
    sql:`INSERT INTO ?? SET ?`,
    values: ['table', {id:'_id', value:'_value'}]
  }; */

db.$entire(P1, P2, P3).then(data => {       /* .$insert()方法的.then()方法的回调函数参数data是一个 数组,
　　　　　　　　　　　　　　　　　　　　　　　　该数组会在P1、P2、P3都执行完毕后才会被返回,
　　　　　　　　　　　　　　　　　　　　　　　　该数组按照参数 P1, P2, P3的顺序 装有所有 mysql语句 的执行结果 */
　　　　　　　　　　// *** .$entire()方法中, P1, P2, P3是异步执行的, 也就是说P1, P2, P3是同时执行的, 无需等P1完成后再执行P2和P3　　
  console.log(data);    // [[{id:'aaa', value:'bbb'}], '...语句用已执行 !', '...语句用已执行 !']
　　　　　　　　　　　　// *** 只有SELECT相关操作的结果类型是数组, DELETE、UPDATE和INSERT操作的结果都是字符串
  console.log(db.sql);  /* *** .$entire()方法的 db.sql属性 代表包含本次操作的所有 mysql语句 的 数组;
　　　　　　　　　　　　　　　　　*!* 如果在执行过程中出现错误, 那么db.sql属性将是 db实例抛出的错误信息
　　　　　　　　　　　　　　　　　db.sql属性的顺序与参数 P1, P2, P3的顺序完全一致;
　　　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
}).catch(err => {
  console.log(err);
  console.log(db.sql);  // 如果在执行过程中出现错误, 此时的db.sql属性是 db实例抛出的错误信息
   //错误信息格式: * _______________async4mysql模块 .$entire()方法 错误* sql语句执行出错, ---> sql: (这里是出错的sql语句)}
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let P1 = {
    sql:`SELECT * FROM table WHERE value = 'value1'`,
    // values:[]            // *当不需要进行防注入操作时, values属性可以省略
  };

  let P2 = {
    sql:`INSERT INTO ?? SET id = ?, value = ?`,
    values:['table', 'id', 'value']
  };

  let P3 = {
    sql:{id:'_id', value:'_value'},       // *** 当sql属性的类型为json时, 即代表该操作为 INSERT操作
    values:'table'                  // *** 当sql属性的类型为json时, values属性不能省略, 且它的类型必须是 字符串 , 它表示INSERT操作的表名称　
  };

  /* P3写法相当于:
    let P3 = {
      sql:`INSERT INTO ?? SET ?`,
      values: ['table', {id:'_id', value:'_value'}]
    }; */

  let result = await db.$entire(P1, P2, P3).catch(err => {  /* 当P1、P2、P3都执行完毕后, 返回result, 它是一个数组
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　它按照参数P1, P2, P3的顺序 装有所有 mysql语句 的执行结果 */
    console.log(err);
    console.log(db.sql);  // 如果在执行过程中出现错误, 此时的db.sql属性是 db实例抛出的错误信息
        //错误信息格式: * _______________async4mysql模块 .$entire()方法 错误* sql语句执行出错, ---> sql: (这里是出错的sql语句)}
      // todo ...
    });

      //*await操作符可以同步执行异步async函数, 因此只有在.$entire()方法执行完毕之后才会执行后面的一系列操作

    console.log(db.sql);  /* *** .$entire()方法的 db.sql属性 代表包含本次操作的所有 mysql语句的数组;
　　　　　　　　　　　　　　　*!* 如果在执行过程中出现错误, 那么db.sql属性将是 db实例抛出的错误信息
　　　　　　　　　　　　　　　db.sql属性的顺序与参数 P1, P2, P3的顺序完全一致;
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */
    // todo ...

    res.json({ok:true, msg:'Oh! yeah~'});
});
```
**6:　.$query()方法**

**.$query()　　同步执行指定的 *所有类型mysql语句* ( 一般用于执行*除了* 增、删、改、查 外的mysql语句 )**

　参数:<br>
　　**.$query**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　连接名　　　　　　　　　必须`<br>
　　`sql:　要执行的mysql语句　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript
******在非async函数中使用: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*由于参数option是一个Array, async4mysql实例将会创建一个 连接池集群
  // 根据参数opt, 这个连接池集群里面将包含2个连接, 他们的名称分别是: 'CONNECT_1' 和 'CONNECT_2', 可以连接到不同的数据库进行操作


let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

db.$query('CONNECT_1', sql_1).then(data => {
  console.log(data);
  console.log(db.sql);
}).catch(err => {
  // todo...
});

let sql_2 = `CREATE TABLE damo (
　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　_int int(2) DEFAULT NULL
　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

db.$query('CONNECT_2', sql_2).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******在async函数中使用: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

  let result = await db.$query('CONNECT_1', sql_1).catch(err => {
    // todo...
  });

  console.log(result);
    //*await操作符可以同步执行异步async函数, 因此只有在sql_1执行完毕之后才会执行后面的一系列操作

  console.log(db.sql);  /* *** new async4mysql()实例(即db对象)的.sql属性代表本次操作的 mysql语句
　　　　　　　　　　　　　　　db.sql 属性在每次执行 db对象的方法 后都会改变 */

  let sql_2 = `CREATE TABLE damo (
　　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　　_int int(2) DEFAULT NULL
　　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

  await db.$query('CONNECT_2', sql_2).catch(err => {
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```

***历史版本信息***
```javascript
　版本:　　　　　　　　　1.0.0

　发布时间:　　　　　　　2019-1-17

　版本说明:　　　　　　　*首版发布*
-------------------------------------
　版本:　　　　　　　　　1.1.0

　发布时间:　　　　　　　2019-1-30

　版本说明:　　　　　　　*删除了方法内部的绝大部分无谓的检测判断,
　　　　　　　　　　　　　稍微提高代码效率*
  ```
　<br><br>
**\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-English API\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-**
　<br><br><br>
**Download:**

```javascript
npm install async4mysql -S
```

**IMPORT:**

```javascript
const async4mysql = require('async4mysql');      //import async4mysql module

const db = new async4mysql(option);      //Create a module instance object
```
* The `new async4mysql` instance will creates a **single connection pool** or **connection pool cluster** based on `the parameter type`

**USE:**

**　Single Connection Pool \-\>**

```javascript
When the option parameter of new async4mysql(option) is a json, then the new async4mysql(option)
 will create a single connection pool (a pool containing only one connection created by the .createpool() method of the mysql module).

Parameter Format:
  {
    host:'localhost',           // Database server name
    user:'root',                // Database server user name
    port:3306,                  // Database server interface
    password:'123456',          // Database server password
    database:'damo'             // The name of the database to connect to
  }
```
\>\>\>\>\>　When **db instance ** is a ** single connection pool **, **db instance ** can use the following 6 methods:<br>
> * `.select()`,　`.delete()`,　`.update()`,　`.insert()`,　`.entire()`,　`.query()`

**1:　.select() method**

**.select()　　Executes the specified mysql SELECT statement synchronously**

　parameters :<br>
　　**.select**( *sql*,　*arr* )<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {      //The option parameter is a json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* Because option is a json, the async4mysql instance
　　　　　　　　　　　　　　　　　　　　　 will create a single connection pool */

let sql_1 = `SELECT * FROM table`;

db.select(sql_1).then(data => {      /*Callback function argument to the.then() method of select()
　　　　　　　　　　　　　　　　　　　'data' is the query result of the sql_1 statement, it's an array*/
  console.log(data);      // [{id:'123', value1:'aaa', value2:'bbb'}, {id:'456', value1:'ccc', value2:'ddd'}, ......]　
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

db.select(sql_2, ['table', 'myTablesId']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT * FROM table`;

  let result_1 = await db.select(sql_1).catch(err => {     //Use .select() method in an async function, the query result 'result_1' for the sql_1 statement is returned directly　　
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

  let result_2 = await db.select(sql_2, ['table', 'myTablesId']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**2:　.delete() method**

**.delete()　　Executes the specified mysql DELETE statement synchronously**

　parameters :<br>
　　**.delete**( *sql*,　*arr* )<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {      //The option parameter is a json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* Because option is a json, the async4mysql
　　　　　　　　　　　　　　　　　　　　　　 will create a single connection pool */

let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

db.delete(sql_1).then(data => {  // The callback function parameter 'data' of the .then() method is a description of the deletion result of the sql_1 statement, it's a string　
  console.log(data);      //  `--->  *async4mysql*模块: DELETE FROM table WHERE id='123456'   --->  语句已执行!`　
　　　　　　　　　　　　　// ***The return value of the.delete() method is not normally required
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

db.delete(sql_2, ['table', '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

  await db.delete(sql_1).catch(err => {     //Use .delete() method in an async function, the return value of the db instance is not required
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***　
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

  await db.delete(sql_2, ['table', '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**3:　.update()方法**

**.update()　　Executes the specified mysql UPDATE statement synchronously**

　parameters :<br>
　　**.update**( *sql*,　*arr* )<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {      //The option parameter is a json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);      /* Because option is a json, the async4mysql
　　　　　　　　　　　　　　　　　　　　　　 will create a single connection pool */

let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

db.update(sql_1).then(data => {  // The callback function parameter 'data' of the .then() method is a description of the deletion result of the sql_1 statement, it's a string
  console.log(data);      //  `--->  *async4mysql*模块: UPDATE table SET value1='aaa' WHERE id='123456'   --->  语句已执行!`　　
　　　　　　　　　　　　　// ***Normally you don't need the return value of the .update() method
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

db.update(sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

  let result_1 = await db.update(sql_1).catch(err => {     //Use .update() method in an async function, the return value of the db instance is not required　
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

  await db.update(sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**4:　.insert() method**

**.insert()　　Executes the specified mysql INSERT statement synchronously**

　parameters :<br>
　　**.insert**( *sql*,　*arr* )<br><br>
　　If the type of *sql* is *string* :<br>
　　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　　`arr:　The array of injection prevention operation　　　　optional`<br>
　　If the type of *sql* is *json* :<br>
　　　`sql:　Insert key-value pairs for the mysql statement to execute (that is, json)　　necessary`<br>
　　　`arr:　Table name string for the data table to manipulate　　　　　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {                        //The option parameter is a json
  host:'localhost',
  user:'root',
  port:3306,
  password:'123456',
  database:'damo'
};

const db = new async4mysql(option);     //*Because option is a json, the async4mysql will create a single connection pool

let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

db.insert(sql_1).then(data => {       //The callback function parameter 'data' of the .then() method is a description of the deletion result of the sql_1 statement, it's a string　
  console.log(data);        //  `--->  *async4mysql*模块: INSERT INTO table SET id='aaa',value1='bbb'   --->  语句已执行!`　
　　　　　　　　　　　　　　// ***The return value from the .insert() method is not normally required
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `INSERT INTO ?? SET ?`;

db.insert(sql_2, ['table', {id:'aaa', value1:'bbb'}]).then(data=>{
  // todo...
}).catch(err => {
  // todo...
});

let json = {id:'eee', value:'fff'};

db.insert(json, 'table').then(data => {    // The equivalent of db.insert(`INSERT INTO ?? SET ?`, ['table', json]).then( ......　
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

  await db.insert(sql_1).catch(err=>{     //Use .insert() method in an async function, the insert statement is executed directly, and its return value is generally not required　
    console.log(err);
  });
    //*The await operator can execute asynchronous async functions synchronously, so the subsequent series of operations are executed only after the completion of sql_1

  console.log(db.sql);      /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `INSERT INTO ?? SET ?`;

  await db.insert(sql_2, ['table', {id:'aaa', value1:'bbb'}]).catch(err=>{
    // todo...
  });

  console.log(db.sql);

  let json = {id:'eee', value:'fff'};

  await db.insert(json, 'table').catch(err => {    //The equivalent of db.insert(`INSERT INTO ?? SET ?`, ['table', json]).catch( ......　
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**5:　.entire() method**

**.entire()　　* The method can perform multiple mysql operations asynchronously and ensure that all mysql operations are completed before returning relevant data**

*parameters*:<br>
```javascript
.entire(
  {sql : '...',  values : [] },
  {sql : '...',  values : [] },
    ......
)
```
* The .entire() method must have a json parameter type and can have any parameter greater than 1
```javascript
{
  sql:  Key-value pairs for mysql statements or INSERT statements to execute        (necessary)
  values:  An array of anti - injection operations store [optional] or the table name string for the INSERT operation (necessary)
}
```
**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {                    // The option parameter is a json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);     // *Because option is a json, the async4mysql will create a single connection pool　

let P1 = {
  sql:`SELECT * FROM table WHERE value = 'value1'`,
  // values:[]            // *'values' properties can be omitted when anti-injection operations are not required
};

let P2 = {
  sql:`INSERT INTO ?? SET id = ?, value = ?`,
  values:['table', 'id', 'value']
};

let P3 = {
  sql:{id:'_id', value:'_value'},      // *** When the sql attribute is of type json, that means the operation must be INSERT
  values:'table'      // *** When the SQL property is of type json, the values property cannot be omitted, and its type must be a string, which represents the table name of the INSERT operation　
};

/* P3 equivalently:
  let P3 = {
    sql:`INSERT INTO ?? SET ?`,
    values: ['table', {id:'_id', value:'_value'}]
  }; */

db.entire(P1, P2, P3).then(data => {       /* The .insert() method's .then() method callback parameter data is an array,
　　　　　　　　　　　　　　　　　　　　　　　　The array will not be returned until P1, P2, and P3 have all been executed,
　　　　　　　　　　　　　　　　　　　　　　　　This array contains the execution results of all mysql statements in the order of the arguments P1, P2, P3 */
　　　　　　// *** In the .entire() method, P1, P2 and P3 are executed asynchronously, that is to say, P1, P2 and P3 are executed simultaneously, there is no need to wait for P1 to complete before executing P2 and P3　
  console.log(data);    // [[{id:'aaa', value:'bbb'}], '...语句用已执行 !', '...语句用已执行 !']
　　　　　　// *** Only SELECT related operations result in arrays, while DELETE, UPDATE, and INSERT operations result in strings
  console.log(db.sql);  /* *** The db.sql attribute in the .entire() method represents an array that contains all mysql statements used in this operation;
　　　　　　　　　　　　　　　*!* If an error occurs during execution, the db.sql attribute will be the error message thrown by the db instance
　　　　　　　　　　　　　　　db.sql attributes are in exactly the same order as the parameters P1, P2, P3;
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);  // If an error occurs during execution, the db.sql attribute is the error message thrown by the db instance
   //Error message format: * _______________async4mysql模块 .entire()方法 错误* sql语句执行出错, ---> sql: (Here is the wrong SQL statement)}　
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let P1 = {
    sql:`SELECT * FROM table WHERE value = 'value1'`,
    // values:[]            // *The 'values' attribute can be omitted when anti-injection operations are not required
  };

  let P2 = {
    sql:`INSERT INTO ?? SET id = ?, value = ?`,
    values:['table', 'id', 'value']
  };

  let P3 = {
    sql:{id:'_id', value:'_value'},       // *** When the SQL attribute is of type json, that means the operation is an INSERT operation
    values:'table'                  // *** When the SQL property is of type json, the values property cannot be omitted, and its type must be a string, which represents the table name of the INSERT operation　
  };

  /* P3 writing the equivalent of:
    let P3 = {
      sql:`INSERT INTO ?? SET ?`,
      values: ['table', {id:'_id', value:'_value'}]
    }; */

  let result = await db.entire(P1, P2, P3).catch(err => {  /* When P1, P2, and P3 have all been executed, return result, which is an array
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　It contains the execution results of all mysql statements in order of arguments P1, P2, P3 */
    console.log(err);
    console.log(db.sql);  // If an error occurs during execution, the db.sql attribute is the error message thrown by the db instance
      //Error message format: * _______________async4mysql模块 .entire()方法 错误* sql语句执行出错, ---> sql: (Here is the wrong SQL statement)}
      // todo ...
    });

　　　//*The await operator can synchronously execute the asynchronous async function, so, only when the. Entire () method is completed does it execute the following sequence of operations

    console.log(db.sql);  /* *** The db.sql attribute in the .entire() method represents an array that contains all mysql statements used in this operation;
　　　　　　　　　　　　　　*!* If an error occurs during execution, the db.sql attribute will be the error message thrown by the db instance
　　　　　　　　　　　　　　db.sql attributes are in exactly the same order as the parameters P1, P2, P3;
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
    // todo ...

    res.json({ok:true, msg:'Oh! yeah~'});
});
```
**6:　.query() method**

**.query()　　Synchronized execution of all types of mysql statements specified (generally used to execute mysql statements except add, delete, change, and check)**

　parameters :<br>
　　**.query**( *sql*,　*arr* )<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option = {                    //The option parameter is a json
  host:'localhost', 
  user:'root', 
  port:3306, 
  password:'123456', 
  database:'damo'
};

const db = new async4mysql(option);     //*Because option is a json, the async4mysql will create a single connection pool

let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

db.query(sql_1).then(data => {
  console.log(data);
  console.log(db.sql);
}).catch(err => {
  // todo...
});

let sql_2 = `CREATE TABLE damo (
　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　_int int(2) DEFAULT NULL
　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

db.query(sql_2).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

  let result = await db.query(sql_1).catch(err => {
    // todo...
  });

  console.log(result);
    //*The await operator can synchronously execute the asynchronous async function, so the subsequent sequence of operations is executed only after the completion of sql_1

  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `CREATE TABLE damo (
　　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　　_int int(2) DEFAULT NULL
　　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

  await db.query(sql_2).catch(err => {
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**\-\-\-Connection Pool Cluster\-\-\-**

```javascript
When the option parameter of new async4mysql(option) is an Array,
new async4mysql(option) then creates a cluster of connection pools (A connection pool that contains one or more connections created by the mysql module’s .createPoolCluster() method).

*Parameter format* ->
  [
    {
      connectName:'CONNECT_1',    // The connection name
      option:{
        host:'localhost',            // Database name
        user:'root_1',               // Database user name
        port:3306,                   // Database interface
        password:'pwd_1',            // Database password
        database:'damo_1'            // The name of the database to connect to
      }
    },
    {
      connectName:'CONNECT_2',    // The connection name
      option:{
        host:'localhost',            // Database name
        user:'root_1',               // Database user name
        port:3306,                   // Database interface
        password:'pwd_2',            // Database password
        database:'damo_2'            // The name of the database to connect to
      }
    },
    ......
  ]
```
**At this point, new async4mysql(option) instance creates a connection named `json.connectName` based on the `json.option` of each *value(json)* in the *parameter array***　<br><br>
**Connection pool cluster can operate on different mysql databases in the same instance!!!(a single connection pool can only operate on the same mysql database)**　<br><br>
\>\>\>\>\>　When a **db object** is a connection pool cluster, the following 6 methods can be used for the **db object**:<br>
> * `.$select()`,　`.$delete()`,　`.$update()`,　`.$insert()`,　`.$entire()`,　`.$query()`

**1:　.$select() method**

**.$select()　　Synchronously execute the specified mysql SELECT statement**

　parameters :<br>
　　**.$select**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　The connection name　　　　　　　　　necessary`<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations　


let sql_1 = `SELECT * FROM table`;

db.$select('CONNECT_1', sql_1).then(data => {      /*Callback function argument to the.then() method of select()
　　　　　　　　　　　　　　　　　　　　　　　　　　　'data' is the query result of the sql_1 statement, it's an array*/
  console.log(data);      // [{id:'123', value1:'aaa', value2:'bbb'}, {id:'456', value1:'ccc', value2:'ddd'}, ......]
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

db.$select('CONNECT_2', sql_2, ['table', 'myTablesId']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT * FROM table`;

  let result_1 = await db.$select('CONNECT_1', sql_1).catch(err => {     //Use .$select() method in an async function, the query result 'result_1' for the sql_1 statement is returned directly　
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `SELECT * FROM ?? WHERE id = ?`;

  let result_2 = await db.$select('CONNECT_2', sql_2, ['table', 'myTablesId']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**2:　.$delete() method**

**.$delete()　　Synchronously execute the specified mysql DELETE statement**

　parameters :<br>
　　**.$delete**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　The connection name　　　　　　　　　necessary`<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations


let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

db.$delete(CONNECT_1, sql_1).then(data => {  // Data, the callback function argument to the .then() method of the .$delete() method, is a description of the deletion result of the sql_1 statement, it's a string　
  console.log(data);      //  `--->  *async4mysql*模块: DELETE FROM table WHERE id='123456'   --->  语句已执行!`
　　　　　　　　　　　　　// ***The return value of the .$delete() method is not normally required
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

db.$delete(CONNECT_2, sql_2, ['table', '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `DELETE * FROM table WHERE id = '123456'`;

  await db.$delete(CONNECT_1, sql_1).catch(err => {     //Use .$delete() method in an async function, the return value of the db instance is not required　
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `DELETE * FROM ?? WHERE id = ?`;

  await db.$delete(CONNECT_2, sql_2, ['table', '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**3:　.$update() method**

**.$update()　　Synchronously execute the specified mysql UPDATE statement**

　parameters :<br>
　　**.$update**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　The connection name　　　　　　　　　necessary`<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations


let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

db.$update('CONNECT_1', sql_1).then(data => {  // The callback function argument to the .then() method of the .$update() method data is a description of the update result of the sql_1 statement, it's a string　
  console.log(data);      //  `--->  *async4mysql*模块: UPDATE table SET value1='aaa' WHERE id='123456'   --->  语句已执行!`　
　　　　　　　　　　　　　// ***Normally you don't need the return value of the .$update() method
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

db.$update('CONNECT_2', sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `UPDATE table SET value1='value1',value2='value2' WHERE id = '123456'`;

  let result_1 = await db.$update('CONNECT_1', sql_1).catch(err => {     //Use .$update() method in an async function, the return value of the db instance is not required　
    console.log(err)
  });
    // ***The await operator can synchronously perform the asynchronous async function, so the subsequent series of operations are performed only after the result_1 returns***
  console.log(result_1);
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `UPDATE ?? SET ? WHERE id = ?`;

  await db.$update('CONNECT_2', sql_2, ['table', {value1:'value1', value2:'value2'}, '123456']).catch(err => {
    // todo...
  });

  console.log(result_2);
  console.log(db.sql);

  res.json([result_1, result_2]);
});
```
**4:　.$insert() method**

**.$insert()　　Synchronously execute the specified mysql INSERT statement**

　parameters :<br>
　　**.$insert**( *connectName*,　*sql*,　*arr* )<br><br>
　　If the type of *sql* is *string* :<br>
　　　`connectName:　The connection name　　　　　　　　　necessary`<br>
　　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　　`arr:　The array of injection prevention operation　　　　optional`<br><br>
　　If the type of *sql* is *json* :<br>
　　　`connectName:　The connection name　　　　　　　　　　　　　　　necessary`<br>
　　　`sql:　Insert contents of the mysql statement to be executed key value pairs(json)　　necessary`<br>
　　　`arr:　Table name string for the data table to manipulate　　　　　　　　necessary`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations


let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

db.$insert('CONNECT_1', sql_1).then(data => {       //The callback function parameter data for the .then() method of the .$insert() method is the insert result description for the sql_1 statement, it's a string　
  console.log(data);        //  `--->  *async4mysql*模块: INSERT INTO table SET id='aaa',value1='bbb'   --->  语句已执行!`
　　　　　　　　　　　　　　// ***The return value from the .$insert() method is not normally required
  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);
});

let sql_2 = `INSERT INTO ?? SET ?`;

db.$insert('CONNECT_2', sql_2, ['table', {id:'aaa', value1:'bbb'}]).then(data=>{
  // todo...
}).catch(err => {
  // todo...
});

let json = {id:'eee', value:'fff'};

db.$insert('CONNECT_1', json, 'table').then(data => {    // The equivalent of db.$insert(`INSERT INTO ?? SET ?`, ['table', json]).then( ......　
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let sql_1 = `INSERT INTO table SET id = 'aaa',value1 = 'bbb'`;

  await db.$insert('CONNECT_1', sql_1).catch(err=>{     //Use .$insert() method in an async function, The INSERT statement is executed directly, and its return value is generally not required　
    console.log(err);
  });
    //*The await operator can synchronously execute the asynchronous async function, so the subsequent sequence of operations is executed only after the completion of sql_1

  console.log(db.sql);      /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `INSERT INTO ?? SET ?`;

  await db.$insert('CONNECT_2', sql_2, ['table', {id:'aaa', value1:'bbb'}]).catch(err=>{
    // todo...
  });

  console.log(db.sql);

  let json = {id:'eee', value:'fff'};

  await db.$insert('CONNECT_1', json, 'table').catch(err => {    //The equivalent of db.$insert(`INSERT INTO ?? SET ?`, ['table', json]).catch( ......　　
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```
**5:　.$entire() method**

**.$entire()　　* You can perform multiple mysql operations asynchronously and ensure that all mysql operations are completed before returning relevant data**

*Parameter*:<br>
```javascript
.$entire(
  {connectName : '...',  sql : '...',  values : [] },
  {connectName : '...',  sql : '...',  values : [] },
    ......
)
```
* The parameter type of the .$entire() method must be **json** and can have **any parameter greater than 1**
```javascript
{
  connectName:  The connection name           (necessary)
  sql:  Key-value pairs for mysql statements or INSERT statements to execute        (necessary)
  values:  Injection-proof operations store arrays of data [optional] or The table name string for the INSERT operation (necessary)
}
```
**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations　


let P1 = {
  connectName:'CONNECT_1',
  sql:`SELECT * FROM table WHERE value = 'value1'`,
  // values:[]            // *The values attribute can be omitted when anti-injection operations are not required　
};

let P2 = {
  connectName:'CONNECT_2',
  sql:`INSERT INTO ?? SET id = ?, value = ?`,
  values:['table', 'id', 'value']
};

let P3 = {
  connectName:'CONNECT_1',
  sql:{id:'_id', value:'_value'},      // *** When the sql attribute is of type json, that means the operation **must be** an INSERT operation　
  values:'table'      // *** When the sql property is of type json, the values property cannot be omitted, and its type must be a string, which represents the table name of the INSERT operation　
};

/* P3 equivalently:
  let P3 = {
    connectName:'CONNECT_1',
    sql:`INSERT INTO ?? SET ?`,
    values: ['table', {id:'_id', value:'_value'}]
  }; */

db.$entire(P1, P2, P3).then(data => {       /* The callback function argument 'data' of the .then() method of the .$insert() method is an array,
　　　　　　　　　　　　　　　　　　　　　　　　The array will not be returned until P1, P2, and P3 have all been executed,
　　　　　　　　　　　　　　　　　　　　　　　　This array contains the execution results of all mysql statements in the order of the arguments P1, P2, P3 */
　　　　　　　　　　// *** In the .$entire() method, P1, P2 and P3 are executed asynchronously, which means that P1, P2 and P3 are executed simultaneously, There is no need to wait for P1 to complete before executing P2 and P3　　
  console.log(data);    // [[{id:'aaa', value:'bbb'}], '...语句用已执行 !', '...语句用已执行 !']
　　　　　　　　　　　　// *** Only SELECT related operations result in arrays, while DELETE, UPDATE, and INSERT operations result in strings
  console.log(db.sql);  /* *** The db.sql attribute in the $entire() method represents an array that contains all mysql statements in this operation;
　　　　　　　　　　　　　　　　　*!* If an error occurs during execution, the db.sql attribute will be the error message thrown by the db instance
　　　　　　　　　　　　　　　　　The order of the db.sql attributes is exactly the same as the order of the parameters P1, P2, P3;
　　　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
}).catch(err => {
  console.log(err);
  console.log(db.sql);  // If an error occurs during execution, the db.sql attribute is the error message thrown by the db instance
   //The format of the error message: * _______________async4mysql模块 .$entire()方法 错误* sql语句执行出错, ---> sql: (Here is the wrong sql statement)}
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res)=>{
  let P1 = {
    sql:`SELECT * FROM table WHERE value = 'value1'`,
    // values:[]            // *The values attribute can be omitted when anti-injection operations are not required
  };

  let P2 = {
    sql:`INSERT INTO ?? SET id = ?, value = ?`,
    values:['table', 'id', 'value']
  };

  let P3 = {
    sql:{id:'_id', value:'_value'},       // *** 当sql属性的类型为json时, 即代表该操作为 INSERT操作
    values:'table'                  // *** 当sql属性的类型为json时, values属性不能省略, 且它的类型必须是 字符串 , 它表示INSERT操作的表名称　
  };

  /* P3 equivalently:
    let P3 = {
      sql:`INSERT INTO ?? SET ?`,
      values: ['table', {id:'_id', value:'_value'}]
    }; */

  let result = await db.$entire(P1, P2, P3).catch(err => {  /* When P1, P2, and P3 have all been executed, return result, which is an array
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　It contains the execution results of all mysql statements in order of arguments P1, P2, P3 */
    console.log(err);
    console.log(db.sql);  // If an error occurs during execution, the db.sql attribute is the error message thrown by the db instance
        //The format of the error message: * _______________async4mysql模块 .$entire()方法 错误* sql语句执行出错, ---> sql: (Here is the wrong sql statement)}
      // todo ...
    });

      //*The 'await' operator can synchronously execute the asynchronous 'async' function, so the subsequent sequence of operations is executed only after the $entire() method is complete

    console.log(db.sql);  /* *** The db.sql attribute in the $entire() method represents an array that contains all mysql statements used in this operation;
　　　　　　　　　　　　　　　*!* If an error occurs during execution, the db.sql attribute will be the error message thrown by the db instance
　　　　　　　　　　　　　　　The order of the db.sql attributes is exactly the same as the order of the parameters P1, P2, P3;
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */
    // todo ...

    res.json({ok:true, msg:'Oh! yeah~'});
});
```
**6:　.$query() method**

**.$query()　　Synchronously execute the specified *all types of mysql statements* ( Generally used to execute any mysql statements *in addition to* add, delete, change, check )**

　parameters :<br>
　　**.$query**( *connectName*,　*sql*,　*arr* )<br>
　　`connectName:　The connection name　　　　　　　　　necessary`<br>
　　`sql:　mysql statement to execute　　　　　　　　necessary`<br>
　　`arr:　The array of injection prevention operation　　　　optional`<br>

**Basal Example :**
```javascript
******Use in a non-async function: ******

const option1 = {
  host:'localhost', 
  user:'root_1', 
  port:3306, 
  password:'123456', 
  database:'damo_1'
};

const option2 = {
  host:'localhost', 
  user:'root_2', 
  port:3306, 
  password:'123456', 
  database:'damo_2'
};

let opt = [{connectName : 'CONNECT_1', option : option1}, {connectName : 'CONNECT_2', option : option2}];

const db = new async4mysql(opt);     //*Since the option is an Array, async4mysql instance will create a cluster of connection pools
  // Depending on the opt parameter, the connection pool cluster will contain two connections, named 'CONNECT_1' and 'CONNECT_2', that can be connected to different databases for operations


let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

db.$query('CONNECT_1', sql_1).then(data => {
  console.log(data);
  console.log(db.sql);
}).catch(err => {
  // todo...
});

let sql_2 = `CREATE TABLE damo (
　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　_int int(2) DEFAULT NULL
　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

db.$query('CONNECT_2', sql_2).then(data => {
  // todo...
}).catch(err => {
  // todo...
});
```
```javascript
******Use in an async function: ******

const express = require('express');
const app = express();
app.listen(8080);

app.post('/damo', async (req, res) => {
  let sql_1 = `SELECT COUNT(table_name) AS total FROM information_schema.tables WHERE table_schema = '库名' AND table_name='表名称'`;　

  let result = await db.$query('CONNECT_1', sql_1).catch(err => {
    // todo...
  });

  console.log(result);
    //*The await operator can synchronously execute the asynchronous async function, so the subsequent sequence of operations is executed only after the completion of sql_1

  console.log(db.sql);  /* *** The .sql attribute of the new async4mysql() instance (that is, the db instance) 
　　　　　　　　　　　　　　　represents the mysql statement for this operation
　　　　　　　　　　　　　　　db.sql attributes change each time a method of a db instance is executed */

  let sql_2 = `CREATE TABLE damo (
　　　　　　　id varchar(11) DEFAULT NULL,
　　　　　　　_varchar varchar(100) DEFAULT NULL,
　　　　　　　_int int(2) DEFAULT NULL
　　　　　　　) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

  await db.$query('CONNECT_2', sql_2).catch(err => {
    // todo...
  });

  console.log(db.sql);

  res.json({ok:true, msg:'Oh! yeah~'});
});
```