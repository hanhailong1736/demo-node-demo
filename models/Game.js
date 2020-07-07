const db = require('../db');
module.exports = db.defineModel('game', {
    //这是游戏管理的数据
    id: {
        type: db.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: db.STRING(50), //游戏名称
    smallIcon:db.STRING(200), //缩略图
    icon: db.STRING(200), //封面图
    video: db.STRING(100), //视频
    likeNum: {
        type:db.INTEGER(10),
        defaultValue: 0,
        allowNull: false
    }, //点赞人数
    status: { //状态  1：上架  2：下架
        type: db.INTEGER(1),
        defaultValue: 1,
        allowNull: false
    },
    remarks: db.STRING(100), //游戏备注
});