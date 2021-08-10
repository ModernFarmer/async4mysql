function _isArray(obj) {           //判断一个对象是否为数组,返回布尔值
  return Object.prototype.toString.call(obj) === '[object Array]';    
};

function _isJson(obj){             //判断一个对象是否为json对象,返回布尔值
	var boolean_isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return boolean_isjson;
};

function toPromise(obj_mysql, sql, arr){    //执行sql语句方法   参数: 构造函数对象(必须), sql语句(必须), 防注入数组(可选)
	return new Promise(function(resolve, reject){
		obj_mysql.pool.getConnection(function(err, connect){  //提取连接池的mysql连接
			if(err){
				reject(err);
			}else{
				let obj_query=connect.query(sql, arr, function(err_query, data){    //执行sql语句
					if(err_query){
						obj_mysql.sql=obj_query.sql;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句(无论执行成功还是失败))

						reject(err_query);
					}else{
						obj_mysql.sql=obj_query.sql;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句(无论执行成功还是失败))

						connect.release();     //释放mysql连接

						if(_isJson(data)){
							resolve(`--->  *async4mysql*模块: ${obj_query.sql}   --->  语句已执行!`);
						}else{
							resolve(data);
						};
					};
				});
			};
		});
	});
};

function toPromise_entire(obj_mysql, index, sql, arr){    //用于.entire()方法的执行sql语句方法   参数: 构造函数对象(必须), sql语句(必须), 防注入数组(可选)
	return new Promise(function(resolve, reject){
		obj_mysql.pool.getConnection(function(err, connect){  //提取连接池的mysql连接
			if(err){
				reject(err);
			}else{
				let obj_query=connect.query(sql, arr, function(err_query, data){    //执行sql语句
					if(err_query){
						obj_mysql.sql=`* _______________async4mysql模块 .entire()方法 错误* sql语句执行出错, ---> sql: ${obj_query.sql}`;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句)

						reject(err_query);
					}else{
						obj_mysql.sql.push({index:index, sql:obj_query.sql});     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句)

						connect.release();     //释放mysql连接

						if(_isJson(data)){
							resolve(`--->  *async4mysql*模块: ${obj_query.sql}   --->  语句已执行!`);
						}else{
							resolve(data);
						};
					};
				});
			};
		});
	});
};

function toPromise_cluster(obj_mysql, connectName, sql, arr){    //执行sql语句方法   参数: 构造函数对象(必须), 连接池集群内的连接名(必须), sql语句(必须), 防注入数组(可选)
	return new Promise(function(resolve, reject){
		obj_mysql.pool.getConnection(connectName, function(err, connect){  //提取名为connectName的连接池的mysql连接
			if(err){
				reject(err);
			}else{
				let obj_query=connect.query(sql, arr, function(err_query, data){    //执行sql语句
					if(err_query){
						obj_mysql.sql=obj_query.sql;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句(无论执行成功还是失败))

						reject(err_query);
					}else{
						obj_mysql.sql=obj_query.sql;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句(无论执行成功还是失败))

						connect.release();     //释放mysql连接

						if(_isJson(data)){
							resolve(`--->  *async4mysql*模块: ${obj_query.sql}   --->  语句已执行!`);
						}else{
							resolve(data);
						};
					};
				});
			};
		});
	});
};

function toPromise_entire_cluster(obj_mysql, index, connectName, sql, arr){    //执行sql语句方法   参数: 构造函数对象(必须), 连接池集群内的连接名(必须), sql语句(必须), 防注入数组(可选)
	return new Promise(function(resolve, reject){
		obj_mysql.pool.getConnection(connectName, function(err, connect){  //提取名为connectName的连接池的mysql连接
			if(err){
				reject(err);
			}else{
				let obj_query=connect.query(sql, arr, function(err_query, data){    //执行sql语句
					if(err_query){
						obj_mysql.sql=`* _______________async4mysql模块 .$entire()方法 错误* : sql语句执行出错, ---> 连接名: ${connectName}; ---> 数据库: ${obj_mysql.dbName[connectName]}; ---> sql: ${obj_query.sql}`;     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句)

						reject(err_query);
					}else{
						obj_mysql.sql.push({index:index, sql:obj_query.sql});     //给async4mysql对象添加.sql属性(用于查看上一次执行的mysql语句)

						connect.release();     //释放mysql连接

						if(_isJson(data)){
							resolve(`--->  *async4mysql*模块: ${obj_query.sql}   --->  语句已执行!`);
						}else{
							resolve(data);
						};
					};
				});
			};
		});
	});
};

module.exports={
	_isArray,
	_isJson,
	toPromise,
	toPromise_entire,
	toPromise_cluster,
	toPromise_entire_cluster
};