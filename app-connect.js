const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); //解析参数
const cookieParser = require('cookie-parser');
const redis = require('redis');
// const uuid = require('node-uuid');
const app = express()
app.use(cors()); //解决跨越
app.use(bodyParser.json({ limit: '20mb' })); //json请求
app.use(bodyParser.json()); //json请求
//application/x-www-form        {extended:true}
app.use(bodyParser.urlencoded({
    extended: false
})); //表单请求
app.listen(9001, () => console.log("服务启动,访问地址为：9001"));
app.use(cookieParser());

/*
const mysql = require('mysql');

const config = require('./config')

//定义连接池
const connPool = function() {
    const conn = mysql.createPool({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database,
        port: config.port,
        connectTimeout: 5000,
        multipleStatements: false, //是否允许一个query包含多条sql语句
        waitForConnections: true, //当无连接可用时，等待还是抛错
        connectLimit: 1000, //连接数
        queueLimit: 0 //最大连接等待数（0为不限制）
    }); //创建连接池

let service = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, conn) {
            if (err) {
                reject(err)
            } else {
                conn.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    conn.release()
                })
            }
        })
    })
}
*/

const createRedis = function() {
    if (!this.cacherTask) {
        this.cacherTask = new Promise((resolve, reject) => {
            const cacheClient = redis.createClient('6379', 'localhost');
            cacheClient.on('ready', function() {
                resolve(cacheClient);
            })
            cacheClient.on('error', function(err) {
                // 如果是连接断开，自动重新连接
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    setTimeout(createRedis, 2000);
                } else {
                    reject(err)
                }
            });
        })
    }
    return this.cacherTask;
}

const redisCache = function() {
    return {
        set: (key, value) => {
            return createRedis().then(cacheClient => {
                return new Promise((resolve, reject) => {
                    cacheClient.set(key, value, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(res)
                    })
                })
            }).catch(err => {})
        },
        get: (key) => {
            return createRedis().then(cacheClient => {
                return new Promise((resolve, reject) => {
                    cacheClient.get(key, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(res)
                    })
                })
            }).catch(err => {})
        }
    }
};

module.exports = {
    app,
    connPool,
    router,
    redisCache
};