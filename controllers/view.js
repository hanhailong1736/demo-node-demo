const {
    app,
    connPool,
} = require('../app-connect');

const Result = require('../utils/tool');
const express = require('express');
const router = express.Router();
const model = require('../model');
const util = require('../utils/util');
const request = require("request");

// 财务管理
app.all('/money/list', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        var currentPage, pageNum;
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        var queryStr = `SELECT *FROM money ORDER BY id DESC LIMIT ${currentPage} , ${pageNum}`;
        if (req.body && req.body.inviteCode) {
            queryStr = `SELECT *FROM money where inviteCode = ${req.body.inviteCode} ORDER BY id DESC LIMIT ${currentPage} , ${pageNum}`;
        }
        //更多接口
        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
})

app.all('/power/list', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        var currentPage, pageNum;
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        //更多接口
        var queryStr = `SELECT user.* ,money.* from user ,money WHERE user.account = money.account  ORDER BY id DESC LIMIT ${currentPage} , ${pageNum};`;
        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
})

app.all('/myuru/list', (req, res) => {
        connPool().getConnection((err, conn) => { //从连接池中拿一个连接
            var currentPage, pageNum;
            if (req.body.currentPage) {
                currentPage = req.body.currentPage
            } else {
                currentPage = 0
            }
            if (req.body.pageNum) {
                pageNum = req.body.pageNum
            } else {
                pageNum = 10
            }
            //更多接口
            var queryStr = `SELECT user.* ,money.* from user ,money WHERE user.account = money.account  ORDER BY id DESC LIMIT ${currentPage} , ${pageNum};`;
            conn.query(queryStr, (e, r) => res.json(new Result({
                data: r
            })))
            conn.release();
        })
    })
    // 改变审核状态
app.all('/money/status/change', (req, res) => {
        connPool().getConnection((err, conn) => { //从连接池中拿一个连接
            var queryStr = `update money set status = ${req.body.status} where id = ${req.body.id};`
            console.log(queryStr);
            conn.query(queryStr, (e, r) => res.json(new Result({
                data: r
            })))
            conn.release();
        })
    })
    //消息管理
app.all('/message/list', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        var currentPage, pageNum;
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        let now = Date.now();
        //更多接口
        var queryStr = `SELECT *FROM message ORDER BY id DESC LIMIT ${currentPage} , ${pageNum}`;
        if (req.body && req.body.headLine) {
            queryStr = `SELECT *FROM message where headLine = '${req.body.headLine}' ORDER BY id DESC LIMIT ${currentPage} , ${pageNum}`;
        }
        // console.log(queryStr);

        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
})

app.all('/message/add', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        let now = Date.now();
        //更多接口
        var queryStr = `INSERT INTO message (headLine,content,updatedAt,createdAt) VALUES ('${req.body.headLine}','${req.body.content}',${now},${now});`;
        console.log(queryStr);

        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
})

app.all('/message/update', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        var currentPage, pageNum;
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        //更多接口
        var queryStr = `UPDATE  message SET headLine = '${req.body.headLine}',content='${req.body.content}' WHERE  id=${req.body.id};`;
        console.log(req.queryStr);

        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
})

app.all('/message/delete', (req, res) => {
    connPool().getConnection((err, conn) => { //从连接池中拿一个连接
        var currentPage, pageNum;
        if (req.body.currentPage) {
            currentPage = req.body.currentPage
        } else {
            currentPage = 0
        }
        if (req.body.pageNum) {
            pageNum = req.body.pageNum
        } else {
            pageNum = 10
        }
        //更多接口
        var queryStr = `DELETE from message where id=${req.body.id};`;
        console.log(queryStr);

        conn.query(queryStr, (e, r) => res.json(new Result({
            data: r
        })))
        conn.release();
    })
});
module.exports = router;



// /game/detail/:id
// /game/update/:id
// /game/add


/*
let login = true
app.all('*',(req,res,next)=>{
    if (!login) return res.json("未登录")
    next();
})

app.post('/test/:data',(req,res)=>{
    return res.json({query:req.query,data:req.params,json:req.body})
})

localhost:8081/test/123?a=b
{
	"c":"d"
}
返回
{
    "query": {
        "a": "b"
    },
    "data": {
        "data": "123"
    },
    "json": {
        "c": "d"
    }
}
*/