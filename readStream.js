/**
 * Created by qqk on 2017/6/19.
 */
'use strict';

var fs = require('fs');

var rs = fs.createReadStream('sample.txt','utf-8');

// 打开一个流:
rs.on('data',function(chunk){
    console.log('DATA:');
    console.log(chunk);
});

rs.on('end',function(){
    console.log('end')
});

rs.on('error',function(){
    console.log('ERROR'+err);
});