var MongoClient = require('mongodb').MongoClient;
// 测试
// var conn_Admin = 'mongodb://139.129.160.232:28328/LesdoAdmin?authMechanism=MONGODB-CR';
//线上
 var conn_Admin = 'mongodb://m:version_1_%^&*@10.163.238.51:28328/LesdoAdmin?authMechanism=MONGODB-CR';

MongoClient.connect(encodeURI(conn_Admin), function (err, db) {
    console.log(err ? err : 'mongoDB连接成功!');
    assert.equal(err, null);
    // 连接送礼数据库
    var SendGiftHistory = db.collection('SendGiftHistory');
    var LiveUserInfo = db.collection('LiveUserInfo');
    // 调试日期1500393600000
    // 日期
    var today = parseInt(new Date((new Date().toLocaleDateString())).getTime());
    var signLiveCount = 0;
    var noSignLiveCount = 0;
    SendGiftHistory.find({
        "time": {
            "$gt": 1500393600000,
            "$lt": 1500393600000 + 86400000
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
                    if (data) {
                        signLiveCount += item.giftPrice;
                    } else {
                        noSignLiveCount += item.giftPrice;
                    }
                    i++;
                    if (i == receiveUserList.length) {
                        console.log('当天签约主播播总收益：' + signLiveCount);
                        console.log('当天非签约主播总收益：' + noSignLiveCount);
                        console.log('当天主播总收益：' + signLiveCount);
                        console.log('当天签约主播结算费用：' + (signLiveCount / 7 * .5).toFixed(2));
                        console.log('当天非签约主播结算费用：' + (noSignLiveCount / 7 * .3).toFixed(2));
                        console.log('当天主播结算费用：' + (signLiveCount / 7 * .5 + noSignLiveCount / 7 * .3).toFixed(2));
                    }
                })
            }
        );
        db.close();
    });

});