///读取文件行
var readline = require('readline');
var fs = require('fs');
var iconv = require('iconv-lite');
var colors = require('colors');

function readLine (filePath,cb){
	var is = fs.createReadStream(filePath);
	console.log('检索: '.yellow+(''+filePath).green+' 文件'.yellow);
	if(is){
		var readLineInterface = readline.createInterface({
			input : is
		});
		var arr = [];
		readLineInterface.on('line',function(line){
			arr.push(line);
		});
		readLineInterface.on('close',function(){
			cb(null,arr);
		})
	}else{
		cb('file not found',[]);
	}
}
module.exports = readLine;