const crypto = require('crypto');
const crypt = {};
crypt.iv = new Buffer([1, 2, 3, 4, 5, 6, 7, 8]);
crypt.encrypt = function (str) {
    let cipher = crypto.createCipheriv('DES', new Buffer('23a89k12'), crypt.iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(new Buffer(str), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted.toString('base64');
};

crypt.decrypt = function (str) {
    let decipher = crypto.createDecipheriv('DES', new Buffer('23a89k12'), crypt.iv);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(new Buffer(str, 'base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

crypt.strToByte = function (str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
};
crypt.byteToString = function (arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
};

module.exports = crypt;