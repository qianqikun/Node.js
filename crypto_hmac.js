/**
 * Created by qqk on 2017/6/20.
 */
const crypto =  require('crypto');

const hmac = crypto.createHmac('sha256','secret-key');

hmac.update('Hello, world!');
hmac.update('Hello, nodejs!');

console.log(hmac.digest('hex'));