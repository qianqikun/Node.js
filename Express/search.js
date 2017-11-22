var request = require('superagent');

module.exports = function search(query, fn) {
    request.get('http://app.lesdo.cn:8080/ledo/live/findLiveTopListByStrType.do')
        .send({strType: 'XinRenTopList', userId: 1002})
        .end(function (res) {
            var data = JSON.parse(res.text);
            // console.log(data.data.list.liveTopList);
            if (Array.isArray(data.data.list.liveTopList)) {
                return fn(null, data.data.list.liveTopList);
            }
            fn(new Error('Bad twitter response'));
        })
};