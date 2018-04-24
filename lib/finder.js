//查找目录下所有文件，并进行判断，进行读取，进行转化，返回结果

var fs = require('fs');

var colors = require('colors');

var async = require('async');

var path = require('path');

var parser = require('./parser');

var read = require('./readline');

var Finder = function( directory,extensions ){
	var thiz = this;
	thiz.directory = directory;
	thiz.extensions = extensions;
	thiz.fileList = [];
	//1.获得目录下文件
	if(fs.existsSync(directory)){
		thiz.start();
	}else{
		console.log('directory is not found'.red);
	}
	return thiz;
}
Finder.prototype.start = function(){
	//1.查找所有的文件
	var thiz = this;
	thiz.findFiles(thiz.directory);
	var list = thiz.fileList;
	console.log('共计检索到符合条件文件个数:'.green+(''+list.length).red);
	//2.开启循环查找
	async.mapLimit(list,10,function(item,cb){
		thiz.parserFile(item,cb);
	},function(err,values){
		thiz.outResult(values);
	});
}
//根据结果比对
Finder.prototype.outResult = function( results ){
	var fileTotal = results.length;//有效文件
	var codeTotal = 0,
		comment = 0,
		code = 0;
	for(var i=0,max=fileTotal;i<fileTotal;i++){
		var obj = results[i];
		if(obj.suc){
			codeTotal += obj.total;
			comment += obj.comment;
			code += obj.code;
		}
	}
	console.log('共计:'.red);
	console.log('    有效文件个数: '.yellow+(''+fileTotal).green+' 个'.yellow);
	console.log('    有效代码行数: '.yellow+(''+code).green+' 行'.yellow);
	console.log('    代码注释行数: '.yellow+(''+comment).green+' 行'.yellow);
	console.log('    注释覆盖率达: '.yellow+(''+Math.floor((comment / codeTotal)*100)).green+' %');
};
Finder.prototype.findFiles = function(directory){
	var thiz = this,extensions = thiz.extensions.toLowerCase();
	var extArr = extensions.split(',');
	if(fs.existsSync(directory)){
		var files= fs.readdirSync(directory);
		for(var i=0,max=files.length;i<max;i++){
			var temp = files[i];
			var filePath = path.join(directory,temp);
			var stats = fs.statSync(filePath);
			if(stats.isDirectory()){
				thiz.findFiles(filePath);
			}else{
				var extname = path.extname(filePath);
				extname = extname.length > 0 ? extname.substring(1) : extname;
				if(extArr.indexOf(extname.toLowerCase()) > -1){
					thiz.fileList.push(filePath);
				}
			}
		}
	}
}
Finder.prototype.parserFile = function(filePath,cb){
	read(filePath,function(err,values){
		if(err){
			cb(null,{suc : false});
		}else{
			var rst = parser(values);
			rst.suc = true;
			cb(null,rst);
		}
	});
}
module.exports = Finder;
