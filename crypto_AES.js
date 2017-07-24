/**
 * Created by qqk on 2017/6/20.
 */
const crypto = require('crypto');

function aesEncryt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

var data = 'Hello,this is my password!';
var key = 'password';
var encrypted = aesEncryt(data, key);
var decrypted = aesDecrypt(encrypted, key);

console.log('password text:' + data);
console.log('Encrypted text:' + encrypted);
console.log('Decrypted text:' + decrypted);

