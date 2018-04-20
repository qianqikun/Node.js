const crypt = require('./utils/crypt');
const request = require('request');


let loginData = JSON.stringify({
    funcID: '1',
    userEmail: '18612560121',
    userPwd: '123456',
    version: '5.8.0',
    isExist: 'NO',
});
// 请求token
let tokenInfo = '';
request.post({
        url: 'http://139.129.160.232:8080/ledoForMid/login.do?version=5.6.2&os=ios',
        form: {cmd: crypt.encrypt(loginData)}
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            tokenInfo = JSON.parse(crypt.decrypt(body));
            // 获得融云token
            let getRongTokenInfo = JSON.stringify({
                "funcID": "42000", //方法Id
                "openID": "6f0ca4139c9937fafe11a67cef47bc25b5a77ae9",
                "userID": tokenInfo.userID, //请求者用户Id
                "deviceID": tokenInfo.deviceID, //设备
                "lang": "zh-Hans",
                "flat": "2",
                "token": tokenInfo.token, //用户token
            });
            request.post({
                    url: 'http://139.129.160.232:8080/ledoForMid/live/getRongToken.do?version=5.6.2&os=ios',
                    form: {cmd: crypt.encrypt(getRongTokenInfo)}
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        getRongTokenRes = JSON.parse(crypt.decrypt(body));
                        console.log(getRongTokenRes)
                        console.log(tokenInfo);
                        let getLiveListData = JSON.stringify({
                            "funcID": "48005", //方法Id
                            "userID": tokenInfo.userID, //请求者用户Id
                            "deviceID": tokenInfo.deviceID, //设备
                            "token": tokenInfo.token, //用户token
                            "type": "0",//请求类型  0 获取推荐直播列表 1 获取关注直播列表
                            "offset": 0,
                            "count": 10,
                        });
                        // 请求直播列表
                        let timer = setInterval(function () {
                            request.post({
                                url: 'http://139.129.160.232:8080/ledoForMid/live/findLiveListInfoV5.do?version=5.6.2&os=ios',
                                form: {cmd: crypt.encrypt(getLiveListData)}
                            }, function (error, response, body) {
                                if (!error && response.statusCode === 200) {
                                    let liveList = JSON.parse(crypt.decrypt(body));
                                    if (liveList.liveList && liveList.liveList != []) {
                                        for (let i = 0; i < liveList.liveList.length; i++) {
                                            if (liveList.liveList[i].isShowBonus == 1) {
                                                console.log('有红包');
                                                console.log(liveList.liveList[i].chatRoomId);
                                                //进入直播间
                                                let enterLiveRoom = JSON.stringify({
                                                    "funcID": "40600", //方法Id
                                                    "userID": tokenInfo.userID, //请求者用户Id
                                                    "lang": "zh-Hans",
                                                    "deviceID": tokenInfo.deviceID, //设备Id
                                                    "token": tokenInfo.token, //用户token
                                                    "flat": "2",
                                                    "enterUserId": liveList.liveList[i].userId
                                                });
                                                request.post({
                                                        url: 'http://139.129.160.232:8080/ledoForMid/live/enterLive.do?version=5.6.2&os=ios',
                                                        form: {cmd: crypt.encrypt(enterLiveRoom)}
                                                    }, function (error, response, body) {
                                                        // console.log(response);
                                                        let liveRoomInfo = JSON.parse(crypt.decrypt(body));
                                                        // console.log(liveRoomInfo);
                                                        if (!error && response.statusCode == 200) {
                                                            data = JSON.parse(crypt.decrypt(body));
                                                            // 获取红包列表
                                                            let getBonusListData = JSON.stringify({
                                                                "funcID": "58002",
                                                                "userID": tokenInfo.userID, //请求者用户Id
                                                                "deviceID": tokenInfo.deviceID, //设备Id
                                                                "token": tokenInfo.token, //用户token
                                                                // "bonusId": liveList.liveList[i].bonusId, //红包ID
                                                                "chatRoomId": liveList.liveList[i].chatRoomId,//融云聊天室ID
                                                                "liveRoomId": liveRoomInfo.liveRoomId
                                                            });
                                                            request.post({
                                                                    url: 'http://139.129.160.232:8080/ledoForMid/bonus/getLiveRoomBonuses.do?version=5.6.2&os=ios',
                                                                    form: {cmd: crypt.encrypt(getBonusListData)}
                                                                }, function (error, response, body) {
                                                                    // console.log(response);
                                                                    if (!error && response.statusCode == 200) {
                                                                        let bonusListInfo = JSON.parse(crypt.decrypt(body));
                                                                        // console.log(bonusListInfo)
                                                                        if (bonusListInfo.data && bonusListInfo.data != []) {
                                                                            for (let j = 0; j < bonusListInfo.data.length; j++) {
                                                                                if (bonusListInfo.data[j].isAllow && bonusListInfo.data[j].isSnatch == 0) {
                                                                                    // 抢红包
                                                                                    console.log('抢红包');
                                                                                    let getBonusData = JSON.stringify({
                                                                                            "funcID": "58004",
                                                                                            "userID": tokenInfo.userID, //请求者用户Id
                                                                                            "deviceID": tokenInfo.deviceID, //设备Id
                                                                                            "token": tokenInfo.token, //用户token
                                                                                            // "bonusId": liveList.liveList[i].bonusId, //红包ID
                                                                                            "chatRoomId": liveList.liveList[i].chatRoomId,//融云聊天室ID
                                                                                        })
                                                                                    ;
                                                                                    request.post({
                                                                                            url: 'http://139.129.160.232:8080/ledoForMid/bonus/snatchBonus.do?version=5.6.2&os=ios',
                                                                                            form: {cmd: crypt.encrypt(getBonusData)}
                                                                                        }, function (error, response, body) {
                                                                                            // console.log(response);
                                                                                            if (!error && response.statusCode == 200) {
                                                                                                data = JSON.parse(crypt.decrypt(body));
                                                                                                console.log(data)
                                                                                            } else {
                                                                                                console.log(error)
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        }

                                                                    } else {
                                                                        console.log(error)
                                                                    }
                                                                }
                                                            );
                                                        } else {
                                                            console.log(error)
                                                        }
                                                    }
                                                );
                                            }
                                        }

                                    }
                                } else {
                                    console.log(error);
                                }
                            })
                        }, 10000);
                    } else {
                        console.log(error)

                    }
                }
            );
        } else {
            console.log(error);
        }
    }
);


// request.post({
//         url: 'http://139.129.160.232:8080/ledoForMid/login.do?version=5.6.2&os=ios',
//         form: {cmd: data}
//     }, function (error, response, body) {
//         // console.log(response);
//         if (!error && response.statusCode == 200) {
//             data = JSON.parse(crypt.decrypt(body));
//             console.log(data)
//         } else {
//             console.log(error)
//
//         }
//     }
// );


