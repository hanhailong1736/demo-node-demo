function Result({
    code = 200,
    message = 'request:OK!',
    data = {}
}) {
    this.code = code;
    this.message = message;
    this.data = data;
}
module.exports = Result;