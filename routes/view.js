const { app, router } = require('../app-connect');
const Result = require('../utils/tool');
var jwt = require('jsonwebtoken');

app.use('/', require('../controllers/common'));
app.use((req, res, next) => {
    // 不同形式获取token值
    let token = req.headers.token || req.query.token || req.body.token;
    // 如果存在token ---- 验证
    if (token) {
        jwt.verify(token, 'hanhailong', function(err, decoded) {
            if (err) {
                res.json(new Result({
                    code: 1002
                }))
            } else {
                if (decoded.account == 'admin' && decoded.password == '123') {
                    req.decoded = decoded;
                    console.log('验证成功', decoded);
                    next()
                } else {
                    res.json(new Result({
                        code: 1002
                    }))
                }
            }
        })
    } else { // 不存在 - 告诉用户---意味着未登录
        res.json(new Result({
            code: 1002
        }))
    }
});
app.use('/login', require('../controllers/login'))
const { app } = require('../app-connect');
