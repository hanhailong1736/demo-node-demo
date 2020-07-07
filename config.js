var NODE_ENV = process.env.NODE_ENV;
var isDevelopment = NODE_ENV == 'development' ? true : false;

var config = {
    dialect: 'mysql',
    database: 'youxi',
    username: 'root',
    password: isDevelopment ? "pass" : '',
    host: 'localhost',
    port: 3306
};

module.exports = config;