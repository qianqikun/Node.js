/**
 * Created by qqk on 2017/6/19.
 */
'use strict';

var fs = require('fs');

fs.readFile('sample.jpg', 'utf-8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var text = data.toString('utf-8');
        fs.writeFile("output.txt",text,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("ok.")
            }
        })
    }
});
