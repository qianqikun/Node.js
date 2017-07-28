var MongoClient = require('mongodb').MongoClient;
// 测试
// var conn_Admin = 'mongodb://139.129.160.232:28328/LesdoAdmin?authMechanism=MONGODB-CR';
//线上
var conn_Admin = 'mongodb://m:version_1_%^&*@10.163.238.51:28328/LesdoAdmin?authMechanism=MONGODB-CR';

MongoClient.connect(encodeURI(conn_Admin), function (err, db) {
    console.log(err ? err : 'mongoDB连接成功!');
    // 连接数据库
    var LiveGift = db.collection('LiveGift');
    var SendGiftHistory = db.collection('SendGiftHistory');
    var giftList = {};
    LiveGift.find({
        "price": {"$gt": 50,}
    }).toArray(function (err, data) {
        // 收礼物用户表
        data.forEach(function (item) {
            giftList[item._id] = {};
            giftList[item._id].giftId = item._id;
            giftList[item._id].giftName = item.giftName;
            giftList[item._id].giftPrice = item.price;
            giftList[item._id].sendTimes = 0;
        });
        var date = "2017-7-17";
        var today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + "-" + (new Date().getDate());

        function giftListCount(date, callback) {
            // 日期
            var times = today.split("-")[2] - date.split("-")[2];
            var timeStamp = parseInt(new Date(date).getTime());
            var startTime = timeStamp;
            var endTime = timeStamp + 86400000;
            // db.getCollection('SendGiftHistory').find({"time": {"$gt": 1500220800000, "$lt": 1500307200000}},{"giftId": 1})
            SendGiftHistory.find({
                "time": {
                    "$gt": startTime,
                    "$lt": endTime
                }
            }).toArray(function (err, data) {
                for(var key in giftList){
                    giftList[key].sendTimes=0
                }
                var i = 0;
                data.forEach(function (item) {
                    if (giftList[item.giftId]) {
                        giftList[item.giftId.toString()].sendTimes += 1;
                    }
                    i++;
                    if (i == data.length) {
                        console.log(date.split("-")[0] + "-" + date.split("-")[1] + '-' + date.split("-")[2]);
                        var arr = [];
                        for (var key in giftList) {
                            if (giftList[key].sendTimes != 0) {
                                arr.push(giftList[key]);
                            }
                        }
                        arr.sort(function (x, y) {
                            return y.sendTimes - x.sendTimes
                        });
                        arr.forEach(function (item) {
                            console.log("礼物Id：" + item.giftId + " 礼物名称：" + item.giftName + " 礼物价格：" + item.giftPrice + " 送出次数：" + item.sendTimes);
                        });
                    }
                });
                if (times > 0) {
                    date = date.split("-")[0] + "-" + date.split("-")[1] + "-" + (parseInt(date.split("-")[2]) + 1);
                    callback(date, callback);
                } else {
                    db.close();
                }
            });
        };
        giftListCount(date, giftListCount);

    });
});