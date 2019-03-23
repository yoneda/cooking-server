'use strict';
const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const cors = require('@koa/cors');

const app = new koa();
const router = new koaRouter();

// corsを許可
app.use(cors());

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

const delayObtainTasks = () => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "a6gy1hq79u3dsfkr",
      password: "ios34vdfh0jbsoj3",
      database: "kqp69lp9xo2uinaf",
      port:"3306",
    });
    connection.connect();
    connection.query("select * from tasks",(err,results,fields)=>{
      const entities = JSON.parse(JSON.stringify(results));
      const filtered = entities.filter((entity)=>entity.removed===0);
      const tasks = filtered.map((entity)=>({id:entity.id,name:entity.name,done:entity.done}));
      resolve(tasks);
    })
    connection.end();
  })
}

const delayUpdateTask = (id,done) => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "a6gy1hq79u3dsfkr",
      password: "ios34vdfh0jbsoj3",
      database: "kqp69lp9xo2uinaf",
      port:"3306",
    });
    connection.connect();
    connection.query("update tasks set done = ? where id = ?",[done,id],(err,results,fields)=>{
      const info = JSON.parse(JSON.stringify(results));
      resolve(info);
    })
    connection.end();
  })
}

const delayAddTask = (name) => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "a6gy1hq79u3dsfkr",
      password: "ios34vdfh0jbsoj3",
      database: "kqp69lp9xo2uinaf",
      port:"3306",
    });
    connection.connect();
    connection.query("insert into tasks(name, done, removed) values(?, false, false)",[name],(err,results,fields)=>{
      const info = JSON.parse(JSON.stringify(results));
      resolve(info);
    })
    connection.end();
  })
}

const delayRemoveTask = (id) => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "zj2x67aktl2o6q2n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "a6gy1hq79u3dsfkr",
      password: "ios34vdfh0jbsoj3",
      database: "kqp69lp9xo2uinaf",
      port:"3306",
    });
    connection.connect();
    connection.query("update tasks set removed = true where id = ?",[id],(err,results,fields)=>{
      const info = JSON.parse(JSON.stringify(results));
      resolve(info);
    })
    connection.end();
  })
}

// すべてのタスクを取得
router.get("/tasks",async(ctx,next)=>{
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを完了状態にする
router.post("/tasks",async(ctx,next)=>{
  const id = ctx.request.body.id;
  const done = ctx.request.body.done;
  const status = await delayUpdateTask(id,done);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを追加する
router.post("/tasks/add",async(ctx,next)=>{
  const name = ctx.request.body.name;
  const status = await delayAddTask(name);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを削除する
router.post("/tasks/remove",async(ctx,next)=>{
  const id = ctx.request.body.id;
  const status = await delayRemoveTask(id);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, ()=>console.log(process.env.PORT));