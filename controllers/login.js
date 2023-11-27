const Result = require('../utils/tool');
const express = require('express');
const router = express.Router();
const model = require('../model');
var jwt = require('jsonwebtoken');
const { redisCache } = require('../app-connect');
var request = require("request");
const util = require('../utils/util');
let User = model.User;
//项考100 获取用户信息
router.all('/miniprogram/getUserInfo', async(req, res) => {
    let params = req.body
    if (Object.keys(params).length == 0) {
        params = req.query
    }
    if (req.cookies && req.cookies.openid) {
        params.openid = req.cookies.openid
    }
    if (!params.openid) {
        res.json(new Result({
            data: {
                status: 0,
                message: '未登陆'
            }
        }))
        return
    }
    redisCache().get(params.openid)
        .then(async cacheUserInfo => {
            if (cacheUserInfo) { //从redis获取到用户信息
                res.json(new Result({
                    data: {
                        form: 'redis',
                        userInfo: JSON.parse(cacheUserInfo)
                    }
                }))
            } else {
                let userInfo = await User.findOne({
                    where: {
                        openid: params.openid
                    }
                })
                if (userInfo) {
                    //从mysql获取到用户信息
                    res.json(new Result({
                        data: {
                            userInfo: userInfo
                        }
                    }));
                    //用户信息存入redis  key：openid  value:userInfo
                    redisCache().set(params.openid, JSON.stringify(userInfo))
                } else {
                    //没有用户信息，需要先注册
                    res.json(new Result({
                        data: {
                            message: '获取用户信息失败'
                        }
                    }))
                }
            }
        })
});
//管理后台登录
router.post('/login', async(req, res) => {
    let params = req.body
    if (Object.keys(params).length == 0) {
        params = req.query
    }
    let account = params.account
    let password = params.password
    if (!account || !password) {
        res.json(new Result({
            code: 1001
        }))
        return;
    }
    if (account != 'admin') {
        res.json(new Result({
            code: 400,
            message: '未查询到该账户信息'
        }))
        return;
    }
    if (password != '123') {
        res.json(new Result({
            code: 400,
            message: '密码错误'
        }))
        return;
    }
    //生成token
    let token = jwt.sign({ account, password }, 'hanhailong', {
        expiresIn: 60 * 60 * 24 * 30 // 授权时效30天
    })
    res.json(new Result({
            data: {
                message: '登录成功',
                account: account,
                token: token
            }
        }))
        /*
        //查
        let userInfo = await User.findOne({
            where: {
                account: params.account
            }
        });
        if (!userInfo) {
            res.json(new Result({
                code: 400,
                message: '未查询到该账户信息' 
            }))
            return;
        }
        if (userInfo.password != params.password) {
            res.json(new Result({
                code: 400,
                message: '密码错误' 
            }))
            return;
        }
        if (userInfo.isBlock) {
            res.json(new Result({
                code: 400,
                message: '该账户触发系统风控，已被限制使用'
            }))
            return;
        }
        //生成token
        let userid = userInfo.id
        let account = userInfo.account
        let token = jwt.sign({ userid, account }, 'hanhailong', {
            expiresIn: 60 * 60 * 24 * 30 // 授权时效30天
        })
        res.json(new Result({
            data: {
                message: '登录成功',
                userInfo: userInfo,
                token: token
            }
        }))
        */
});

module.exports = router;