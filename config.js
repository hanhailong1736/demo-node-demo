var NODE_ENV = process.env.NODE_ENV;
var isDevelopment = NODE_ENV == 'development' ? true : false;

var config = {
    dialect: 'mysql',
    database: 'excel',
    username: 'root',
    password: isDevelopment ? "HaiLong1736&" : 'HaiLong1736&',
    host: 'localhost',
    port: 3306
};

module.exports = config;