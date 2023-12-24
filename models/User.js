const db = require('../db');
module.exports = db.defineModel('user', {
    //这是用户的数据
    id: {
        type: db.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    account: {
        type: db.STRING(20),
        allowNull: false,
        unique: true
    }, //账号
    password: db.STRING(20), //密码
    nickName: db.STRING(20),
    mobile: db.STRING(20)
});