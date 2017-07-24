/**
 * Created by qqk on 2017/6/19.
 */
'use strict';

var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');
//从命令行参数获取root目录，默认目录是当前目录：
var root = path.resolve(process.argv[2] || '.');

var filenames = ['index.html', 'default.html'];

console.log('Static root dir:' + root);

//创建服务器：
var server = http.createServer(function (request, response) {
    //获得URL的path，类似'css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    // console.log(pathname);
    // 获得对应的本地文件路径，类似'/srv/www/css/bootstrap.css':
    var filepath = path.join(root, pathname);
    fs.stat(filepath, function (err, stats) {
        // 判断路径是不是文件
        if (err) {
            failure(response, '<h1>404 Not Found</h1>')
        } else if (stats.isFile()) {
            success(response, filepath)
        } else if (stats.isDirectory()) {
            fs.readdir(filepath, (err, files) => {
                if (err) {
                    failure(response, '<h1>该目录不存在</h1>')
                } else {
                    var name = files.filter((x) => {
                        return x === filenames[0] || x === filenames[1];
                    });
                    if (name.length != 0) {
                        success(response, path.join(filepath, name[0]))
                    } else {
                        failure(response, '<h1>不存在主页</h1>');
                    }
                }
            })
        }
    })
});
function success(response, filePath) {
    console.log('200 ' + filePath);
    response.writeHead(200);
    fs.createReadStream(filePath).pipe(response)
}
function failure(response, string) {
    // 发送404响应:
    response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(string);
}
server.listen(7070);
console.log('Server is running at http://127.0.0.1:7070/')