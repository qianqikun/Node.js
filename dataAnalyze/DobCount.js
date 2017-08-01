function DobCount(timeStamp, db) {
    // 连接表
    var IapppayHistory = db.collection('IapppayHistory'),
        iosOrderHistory = db.collection('iosOrderHistory'),
        Goods = db.collection('Goods'),
        ibayCount = 0,
        ibayDobCount = 0,
        iosCount = 0,
        iosDobCount = 0
    iosOrderHistory.find({
        "orderTime": {
            "$gt": timeStamp,
            "$lt": timeStamp + 86400000
        }, 'payStatus': 1
    }).toArray(function (err, data) {
        var dataList = data;
        if (dataList.length != 0) {
            var i = 0;
            dataList.forEach(function (item) {
                Goods.findOne({'iTunesId': item['productId']}, {
                    'price': 1,
                    'coinRealNum': 1,
                    'name': 1
                }, function (err, data) {
                    if (item['productId'] && item['productId'].indexOf('vip') == -1) {
                        iosCount += parseInt(data['price']);
                        if (data['coinRealNum'] != null) {
                            iosDobCount += parseInt(data['coinRealNum']);
                        } else {
                            iosDobCount += parseInt(data['name'])
                        }
                    }
                    i++;
                    if (i == dataList.length) {
                        console.log("苹果卖出Dob：" + iosDobCount + '个');
                        console.log("苹果支付金额：" + iosCount + '元');
                    }
                });
            })
        } else {
            console.log("苹果支付金额：0元");
        }
    });
    IapppayHistory.find({
        "orderTime": {
            "$gt": timeStamp,
            "$lt": timeStamp + 86400000
        }, 'payTime': {$exists: true}
    }).toArray(function (err, data) {
        if (data.length != 0) {
            var i = 0;
            var dataList = data;
            dataList.forEach(function (item) {
                Goods.findOne({'ibayId': item['waresid'], "type": "1"}, {
                    'price': 1,
                    'coinRealNum': 1,
                    'name': 1
                }, function (err, data) {
                    if ([10, 11, 12, 13].indexOf(item['waresid']) == -1) {
                        ibayCount += parseInt(data['price']);
                        if (data['coinRealNum'] != null) {
                            ibayDobCount += parseInt(data['coinRealNum']);
                        } else {
                            ibayDobCount += parseInt(data['name'])
                        }
                    }

                    i++;
                    if (i == dataList.length) {
                        console.log("爱贝卖出Dob：" + ibayDobCount + '个');
                        console.log("爱贝支付金额：" + ibayCount + '元');
                    }
                });
            })
        } else {
            console.log("爱贝支付金额：0元");
        }
    });
}

module.exports = DobCount;