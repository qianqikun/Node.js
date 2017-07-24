/**
 * Created by qqk on 2017/6/19.
 */
'use strict';
var url = require('url');
var path = require('path');
console.log(url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash'));

var workDir = path.resolve('.');
console.log(workDir);
var filePath = path.join(workDir,'pub','index.html');
console.log(filePath);