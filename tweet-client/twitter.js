var qs = require('querystring'),
    http = require('http');

var search = process.argv.slice(2).join(' ').trim();

if (!search.length) {
    return console.log('\n   Usage:node tweets <search term>\n');
}

console.log('\n   searching for: \033[96m' + search + '\033[96m\n');
http.request({
    // host: 'https://api.twitter.com',
    host: 'http://twitter.com',
    // path: '/1.1/search/tweets.json?' + qs.stringify({q: search}),
    path: '/search?' + qs.stringify({q: search}),
    method: 'GET'
}, function (res) {
    console.log(res);
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        body += chunk
    })
    res.on('end', function () {
        var obj = JSON.parse(body);
        obj.results.forEach(function (tweet) {
            console.log('   \033[90' + tweet.text + '\033[39m');
            console.log('   \033[94' + tweet.form_user + '\033[39m');
            console.log('--');

        })
    })
}).end();