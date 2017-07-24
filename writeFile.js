/**
 * Created by qqk on 2017/6/19.
 */
'use strict';
var fs =require("fs");

var data = "Hello,Node.js";

fs.writeFile("output.txt",data,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("ok.")
    }
});