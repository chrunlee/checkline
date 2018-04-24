//对字符串进行解析
var colors = require('colors');

function parser ( arr ){//一个arr为一个文本文件
	/***
	1. // 开头或者包含
	2./* 开头 *\/结尾

	***/
	var rs = {
		total : arr.length,//总行数
		comment : 0,//注释
		code : 0//代码行
	};
	var commentStart = false;
	for(var i=0,max=arr.length;i<max;i++){
		var str = arr[i];
		str = str.replace(/\s/g,'')
		str = str.replace(/\\t/g,'')
		if(str == ''){
			rs.total --;
		}else if(/^\/\//g.test(str)){//开头
			rs.comment ++;
		}else if(str.indexOf('/*') > -1 && str.indexOf('*/') > -1){
			rs.comment ++ ;
		}else if(str.indexOf('/*') > -1){
			rs.comment ++;
			commentStart = true;
		}else if(str.indexOf('*/') > -1){
			rs.comment ++ ;
			commentStart = false;
		}else{
			if(commentStart){
				rs.comment ++ ;
			}else{
				rs.code ++ ;
			}
		}
	}
	// console.log('文件总行数:'.green+(rs.total+'').red+'');
	return rs;
}

module.exports = parser;