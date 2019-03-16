'use strict';
const koa = require('koa');
const koaRouter = require('koa-router');
const json = require('koa-json');

const app = new koa();
const router = new koaRouter();

// jsonを返す場合 pretty-print
app.use(json());

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

router.get("/tasks",async(ctx,next)=>{
  const mysql = require("mysql");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tododb"
  });
  connection.connect();
  connection.query("select * from tasks",(err,results,fields)=>{
    results.forEach((result)=>{
      console.log(result.name);
    });
  })
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, ()=>console.log("running on port 3000"));