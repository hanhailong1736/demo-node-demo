const formatDateTime = function(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};
var numword = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const emailCode = function(length) {
    var Str = "";
    for (var i = 0; i < length; i++) {
        Str += numword[Math.floor(Math.random() * numword.length)];
    }
    return Str;
}

var password = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
    "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
]; //!@#$%^&*
const passData = function(length) {
    var Str = "";
    for (var i = 0; i < length; i++) {
        Str += password[Math.floor(Math.random() * password.length)];
    }
    return Str;
}

/**
 * {
      bizType: 'wap',
      host: 'msearch',
      type: '3'
    }  =>  "bizType=wap&host=msearch&type=3"
 * @param {*} data 
 */
const formatParams = (data) => {
    let arr = [];
    for (let name in data) {
        if (typeof(data[name]) == 'object' && data[name].length) { //数组
            for (let index = 0; index < data[name].length; index++) {
                arr.push(encodeURIComponent(name) + '[' + index + ']=' + encodeURIComponent(
                    data[name][index]));
            }
        } else {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
    }
    return arr.join('&');
}

var xmlreader = require("xmlreader");

var wxpay = {
    //把金额转为分
    getmoney: function(money) {
        return parseFloat(money) * 100;
    },

    // 随机字符串产生函数  
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },

    // 时间戳产生函数  
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    //签名加密算法
    paysignjsapi: function(ret) {
        var stringA = raw(ret);
        stringA += '&key=dWDFmeIifZSF7c2bQrSlXi6uioLmTLS9';
        var crypto = require('crypto');
        return crypto.createHash('md5').update(stringA, 'utf8').digest('hex').toUpperCase();
    },
    getXMLNodeValue: function(xml) {
        // var tmp = xml.split("<"+node_name+">");
        // console.log('tmp',tmp);
        // var _tmp = tmp[1].split("</"+node_name+">");
        // console.log('_tmp',_tmp);
        // return _tmp[0];
        xmlreader.read(xml, function(errors, response) {
            if (null !== errors) {
                console.log(errors)
                return;
            }
            console.log('长度===', response.xml.prepay_id.text().length);
            var prepay_id = response.xml.prepay_id.text();
            console.log('解析后的prepay_id==', prepay_id);
            return prepay_id;
        });
    }
}

function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}


// module.exports = wxpay;

module.exports = {
    formatDateTime: formatDateTime,
    passData: passData,
    emailCode: emailCode,
    formatParams: formatParams,
    wxpay: wxpay
}