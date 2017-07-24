/**
 * Created by qqk on 2017/6/19.
 */
'use strict';
var s= "Hello";

function greet(name){
    console.log(s+','+name+'!');
}
function hello(){
    console.log("Hello world!");
}
module.exports = {
    hello:hello,
    greet:greet
};
