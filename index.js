const mysql=require('mysql');
const methods=require('./lib/___methods.js');

const {_isArray, _isJson, toPromise, toPromise_entire, toPromise_cluster, toPromise_entire_cluster}=methods;

function async4mysql(obj){     //构造函数
	this.sql='';
	if(_isJson(obj)){           //如果参数obj是一个json, 则创建连接池
		this.type='sole';           //如果参数obj是一个json, 设置构造函数的type属性为'sole'(表示单一连接池)
		this.pool=mysql.createPool(obj);      //创建连接池
	}else if(_isArray(obj)){           //如果参数obj是一个Array, 则创建连接池集群
		//如果参数obj是一个Array, 它的格式必须为 [{connectName:'NAME1', option:{...}}, {connectName:'NAME2', option:{...}}...]
		this.type='cluster';           //如果参数obj是一个Array, 设置构造函数的type属性为'cluster'(表示连接池集群)
		this.pool=mysql.createPoolCluster();   //创建连接池集群
		this.dbName={};       //**this.dbName属性是连接池集群专有** 存放着各个连接所对应的 数据库名称 , 格式: {连接名1:数据库名称1, 连接名2:数据库名称2, ...}
		obj.forEach(val=>{             //根据每个参数, 将连接放入连接池集群
			this.pool.add(val.connectName, val.option);
			this.dbName[val.connectName]=val.option.database;
		});
	}
};

async4mysql.prototype.select=async4mysql.prototype.delete=async4mysql.prototype.update=async4mysql.prototype.query=function(sql, arr=[]){    //.select()方法、.delete()方法、.update()方法、.query()方法, 参数: mysql字符串(必须), 数组(可选)
	let _this=this;
	return toPromise(_this, sql, arr);        //调用 单一连接池执行sql语句 toPromise()方法
};

async4mysql.prototype.insert=function(sql, arr=[]){    //.insert()方法, 参数: mysql字符串 或者 json(必须), 数组(可选), 数组(可选)
	if(typeof sql==='string'){
		let _this=this;
		return toPromise(_this, sql, arr);        //调用 单一连接池执行sql语句 toPromise()方法
	}else if(_isJson(sql)){
		let _this=this;
		return toPromise(_this, `INSERT INTO ?? SET ?`, [arr, sql]);      //调用 单一连接池执行sql语句 toPromise()方法
	}else{
		return new Promise(function(resolve, reject){
			reject('--->  *async4mysql*模块: .insert()方法的第一个参数必须是 字符串 或者是 一个json!');
		});
	};
};

async4mysql.prototype._entire_= function(index, sql, arr=[]){      //._entire_()方法, 用于执行sql语句并将结果转换成一个 Promise对象. **专供.entire()方法调用
	if(typeof sql==='string'){      //判断sql语句是否为 字符串
		let _this=this;
		return toPromise_entire(_this, index, sql, arr);        //调用 单一连接池执行sql语句 toPromise()方法
	}else if(_isJson(sql)){      //判断sql语句是否为 json
		let _this=this;
		return toPromise_entire(_this, index, `INSERT INTO ?? SET ?`, [arr, sql]);      //调用 单一连接池执行sql语句 toPromise()方法
	}else{
		return new Promise(function(resolve, reject){
			reject('--->  *async4mysql*模块: .entire()方法的参数中的 方法 的参数必须要是一个 字符串 或者是一个 json !');
		});
	};
};

async4mysql.prototype.entire=function(){         //.entire()方法, .entire()方法的参数可以是任意个, 参数: {sql:`...`, values:'...'}, {sql:`...`, values:'...'}, ...
	this.sql=[];
	if(arguments.length>0){
		let arr=[];
		let _this=this;

		for(let i=0; i<arguments.length; i++){
			arr.push(_this._entire_(i, arguments[i].sql, arguments[i].values));     //根据参数按顺序调用._entire_()方法, 得到一个装着Promise对象的数组供Promise.all()方法使用
		};

		return new Promise(function(resolve, reject){     //3.返回步骤2的Promise对象
			Promise.all(arr).then(function(data){    //1.异步执行查询操作
				_this.sql.sort(function(obj1, obj2){
					let num1=obj1.index;
					let num2=obj2.index;
					return num1-num2;
				});

				_this.sql=_this.sql.map(val=>{
					return val.sql;
				});

				resolve(data);             //2.将异步执行的结果转换成Promise对象
			}).catch(function(err){
				reject(err);
			});
		});
	}else{
		return new Promise(function(resolve, reject){
			this.sql_now='';
			reject('--->  *async4mysql*模块: .entire()方法 缺少参数 !');
		});
	};
};

async4mysql.prototype.$select=async4mysql.prototype.$delete=async4mysql.prototype.$update=async4mysql.prototype.$query=function(connectName, sql, arr=[]){    //.$select()方法, 参数: 连接名字符串(必须), mysql字符串(必须), 数组(可选)
	let _this=this;
	return toPromise_cluster(_this, connectName, sql, arr);        //调用 连接池集群执行sql语句 toPromise_cluster()方法
};

async4mysql.prototype.$insert=function(connectName, sql, arr=[]){    //.$insert()方法, 参数: 连接名字符串(必须), mysql字符串 或者 json(必须), 数组(可选)
	if(typeof sql==='string'){
		let _this=this;
		return toPromise_cluster(_this, connectName, sql, arr);        //调用 连接池集群执行sql语句 toPromise_cluster()方法
	}else if(_isJson(sql)){
		let _this=this;
		return toPromise_cluster(_this, connectName, `INSERT INTO ?? SET ?`, [arr, sql]);        //调用 连接池集群执行sql语句 toPromise_cluster()方法
	}else{
		return new Promise(function(resolve, reject){
			reject('--->  *async4mysql*模块: .$insert()方法的第二个参数必须是 字符串 或者是 一个json!');
		});
	};
};

async4mysql.prototype._$entire_= function(index, connectName, sql, arr=[]){      //._$entire_()方法, 用于执行sql语句并将结果转换成一个 Promise对象. **专供.$entire()方法调用
	if(typeof sql==='string'){      //判断sql语句是否为 字符串
		let _this=this;
		return toPromise_entire_cluster(_this, index, connectName, sql, arr);        //调用 单一连接池执行sql语句 toPromise()方法
	}else if(_isJson(sql)){      //判断sql语句是否为 json
		let _this=this;
		return toPromise_entire_cluster(_this, index, connectName, `INSERT INTO ?? SET ?`, [arr, sql]);      //调用 单一连接池执行sql语句 toPromise()方法
	}else{
		return new Promise(function(resolve, reject){
			reject('--->  *async4mysql*模块: .entire()方法的参数中的 方法 的参数必须要是一个 字符串 或者是一个 json !');
		});
	};
};

async4mysql.prototype.$entire=function(){         //.$entire()方法, .$entire()方法的参数可以是任意个, 参数: {connectName:'name1', sql:`...`, values:'...'}, {connectName:'name2', sql:`...`, values:'...'}, ...
	this.sql=[];
	if(arguments.length>0){
		let arr=[];
		let _this=this;

		for(let i=0; i<arguments.length; i++){
			arr.push(_this._$entire_(i, arguments[i].connectName, arguments[i].sql, arguments[i].values));     //根据参数按顺序调用._$entire_()方法, 得到一个装着Promise对象的数组供Promise.all()方法使用
		};

		return new Promise(function(resolve, reject){     //3.返回步骤2的Promise对象
			Promise.all(arr).then(function(data){    //1.异步执行查询操作
				_this.sql.sort(function(obj1, obj2){
					let num1=obj1.index;
					let num2=obj2.index;
					return num1-num2;
				});

				_this.sql=_this.sql.map(val=>{
					return val.sql;
				});

				resolve(data);             //2.将异步执行的结果转换成Promise对象
			}).catch(function(err){
				reject(err);
			});
		});
	}else{
		return new Promise(function(resolve, reject){
			this.sql_now='';
			reject('--->  *async4mysql*模块: .entire()方法 缺少参数 !');
		});
	};
};

module.exports=async4mysql;       //导出模块
