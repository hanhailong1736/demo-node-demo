function Result({
    error_code = 0,
    message = 'request:OK!',
    data = {}
}) {
    this.error_code = error_code;
    this.message = message;
    this.data = data;
}
module.exports = Result;