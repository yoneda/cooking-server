'use strict';
const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');

const app = new koa();
const router = new koaRouter();

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

router.get("/hello",async(ctx,next)=>{
  ctx.body = "hello world";
});

// 遅延処理

// Node.js は元々、非同期のプログラム(同期しない、時間がかかる処理があってもそれを待たないで次のプロセスにうつる)
// Promise は処理が終わるのを待って、終わりしだいresolveの結果を返すオブジェクト。失敗した場合はrejectを返す。
// 関数の前にasync をつけると、返り値がPromise になる
// awaitは、async関数の実行を一時停止してPromiseの解決を待ちます。そしてPromiseでresolveされる値を返します。
// awaitはsync宣言された関数の中でのみ有効
const sayHello = new Promise((resolve,reject)=>{
  setTimeout(()=>resolve({text:"sorry, I'm late. heloo!!!"}),5000);
})

router.get("/delayHello",async(ctx,next)=>{
  const yourTalk = await sayHello;
  ctx.body = yourTalk.text;
})

const delayObtainTasks = () => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "tododb"
    });
    connection.connect();
    connection.query("select * from tasks",(err,results,fields)=>{
      const tasks = JSON.parse(JSON.stringify(results));
      resolve(tasks);
    })
    connection.end();
  })
}

const delayUpdateTask = (id,done) => {
  return new Promise((resolve,reject)=>{
    const mysql = require("mysql");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "tododb"
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
      host: "localhost",
      user: "root",
      password: "",
      database: "tododb"
    });
    connection.connect();
    connection.query("insert into tasks(name, done, removed) values(?, false, false)",[name],(err,results,fields)=>{
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
  const info = await delayAddTask(name);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, ()=>console.log("running on port 3000"));