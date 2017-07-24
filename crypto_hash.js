/**
 * Created by qqk on 2017/6/20.
 */
const crypto = require('crypto_hash');

const hash = crypto.createHash('sha1');

hash.update('Hello, world!');
hash.update('Hello, nodejs!');

console.log(hash.digest('hex'));

