/*
code:错误列表

code:200,//正确的请求
message = 'request:OK!',

code: 400,
message: '请求错误',//具体错误信息

code: 1001,
message: '参数错误或缺失',

code: 1002,
message: '未登录或登录过期',

*/
function Result({
    code = 200,
    message = 'request:OK!',
    data = {}
}) {

    if (code == 1001) {
        message = '参数错误或缺失'
    } else if (code == 1002) {
        message = '未登录或登录过期'
    }

    this.code = code;
    this.message = message;
    this.data = data;
}
module.exports = Result;