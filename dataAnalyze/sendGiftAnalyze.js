var MongoClient = require('mongodb').MongoClient,
    DobCount = require('./DobCount');
// 测试
// var conn_Admin = 'mongodb://139.129.160.232:28328/LesdoAdmin?authMechanism=MONGODB-CR';
//线上
var conn_Admin = 'mongodb://m:version_1_%^&*@10.163.238.51:28328/LesdoAdmin?authMechanism=MONGODB-CR',
    date = "2017-7-29",
    dateTime = new Date(date).getTime(),
    today = new Date(new Date().toLocaleDateString()).getTime(),
    timeStamp = parseInt(dateTime);
console.log(date);

function dailyIncome(timeStamp) {

    MongoClient.connect(encodeURI(conn_Admin), function (err, db) {
        console.log(err ? err : 'mongoDB连接成功!');
        // 连接送礼数据库
        var SendGiftHistory = db.collection('SendGiftHistory'),
            LiveUserInfo = db.collection('LiveUserInfo');
        // 调试日期1500393600000
        // 日期

        var startTime = timeStamp,
            endTime = timeStamp + 86400000,
            signLiveCount = 0,
            noSignLiveCount = 0,
            totalCount = 0;
        console.log(date);
        DobCount(timeStamp, db);
        SendGiftHistory.find({
            "time": {
                "$gt": startTime,
                "$lt": endTime
            }
        }).toArray(function (err, data) {
            // 收礼物用户表
            var receiveUserList = [];
            data.forEach(function (item) {
                var sendRecord = {};
                sendRecord.receiveId = item.receiveUserId;
                sendRecord.giftPrice = item.giftPrice;
                receiveUserList.push(sendRecord)
            });
            var i = 0;
            receiveUserList.forEach(function (item) {
                    LiveUserInfo.findOne({
                        "userTvType": 1,
                        "userTvStatus": 0,
                        "userId": item.receiveId
                    }, {userId: 1}, function (err, data) {
                        totalCount += item.giftPrice;
                        if (data) {
                            signLiveCount += item.giftPrice;
                        } else {
                            noSignLiveCount += item.giftPrice;
                        }
                        i++;
                        if (i == receiveUserList.length) {
                            console.log('当天签约主播播总收益：' + signLiveCount + 'DO币');
                            console.log('当天非签约主播总收益：' + noSignLiveCount + 'DO币');
                            console.log('当天主播总收益：' + (signLiveCount + noSignLiveCount) + 'DO币');
                            console.log('不加判断当天主播总收益：' + totalCount + 'DO币');
                            console.log('当天签约主播结算费用：' + (signLiveCount / 7 * .5).toFixed(2) + '元');
                            console.log('当天非签约主播结算费用：' + (noSignLiveCount / 7 * .3).toFixed(2) + '元');
                            console.log('当天主播结算费用：' + (signLiveCount / 7 * .5 + noSignLiveCount / 7 * .3).toFixed(2) + '元');
                            db.close();
                        }
                    })
                }
            );
        });
    });
}

dailyIncome(timeStamp);