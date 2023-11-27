const Sequelize = require('sequelize');

const uuid = require('node-uuid');

const config = require('./config');

console.log('init sequelize...');

function generateId() {
    return uuid.v1();
}

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    //解决中文输入问题
    define: {
        'underscored': false,
        'charset': 'utf8mb4'
    },
    timezone: '+08:00' //东八时区
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            if (value.allowNull == false) {
                value.allowNull = false
            } else {
                value.allowNull = true
            }
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: true
            };
        }
    }
    // attrs.id = {
    //     type: ID_TYPE,
    //     primaryKey: true
    // };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: true,
        get() {
            return parseInt(this.getDataValue('createdAt'))
                // return formatDateTime(parseInt(this.getDataValue('createdAt')));
        }
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: true,
        get() {
            return parseInt(this.getDataValue('updatedAt'))
                // return formatDateTime(parseInt(this.getDataValue('updatedAt')));
        }
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: true
    };
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function(k, v) {
        if (k === 'type') {
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            // 强制为每一行都更新
            beforeBulkUpdate: function(options) {
                options.individualHooks = true
            },
            /*// 或者在每一次update时激活这个options
            await myTest.update({ testName: 'xxxx' },
            {
                where: {
                id: '567f41c4ceb7447aacf5900b07dde205'
                },
                individualHooks: true
            })
            */
            beforeValidate: function(obj) {
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    // if (!obj.id) {
                    //     obj.id = generateId();
                    // }
                    const now = Date.now()
                    obj.createdAt = now
                    obj.updatedAt = now
                        // obj.version = 0;
                }
            },
            /*不执行？？
            beforeCreate(instance, options) {
                console.log('beforeCreate...');
                // if (!instance.id) {
                //     instance.id = generateId()
                // }
                const now = Date.now()
                instance.createdAt = now
                instance.updatedAt = now
                // obj.version = 0;
            },
            */
            beforeUpdate(instance) {
                console.log('beforeUpdate...');
                instance.updatedAt = Date.now()
                    // obj.version++;
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
// string integer   bigint  text bouble  dateonly  boolean
var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: false });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;



const formatDateTime = function(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    if (!format) {
        format = 'yyyy-MM-dd HH:mm:ss'
    }
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