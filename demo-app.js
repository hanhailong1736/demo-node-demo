// routes 路由  express
const viewRouter = require('./routes/view');
/*
//koa2
const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const app = new Koa();

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(9000);
console.log('app started at port 9000...');

/*
const model = require('./model');
const uuid = require('node-uuid');
let
    User = model.User,
    List = model.List,
    Detail = model.Detail;

(async() => {
    //增
     var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
    //删
        var p = await queryFromSomewhere();
        await p.destroy();
    //改
        var p = await queryFromSomewhere();
        p.gender = true;
        p.updatedAt = Date.now();
        p.version ++;
        await p.save();

    //查询数据  
    var list = await List.findAll({
        // where: {
        //     name: 'Odie',
        //     //ownerId:'ea2c25c9-6bdd-4c0e-a85d-986e030dcf2e'
        // }
    });
    console.log(`find ${list.length} list:`);
    var detail = await Detail.findAll({
        // where: {
        //     name: 'Odie',
        //     //ownerId:'ea2c25c9-6bdd-4c0e-a85d-986e030dcf2e'
        // }
    });
    console.log(`find ${detail.length} detail:`);
    for (let element of detail) {
        if (element.time == 0) {
            //删除数据
            await element.destroy();
            console.log(`${element.name} was destroyed.`);
        }
    }
})();
*/