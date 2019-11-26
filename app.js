"use strict";
const koa = require("koa");
const koaRouter = require("koa-router");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const cors = require("@koa/cors");

const app = new koa();
const router = new koaRouter();

// corsを許可
app.use(cors());

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

// すべてのユーザ情報を取得
router.get("/users", async (ctx, next) => {
  const results = await new Promise(resolve => {
    const mysql = require("mysql");
    const config = require("./dbconfig");
    const connection = mysql.createConnection(config);
    connection.connect();
    connection.query("select * from users", (errors, results, fields) => {
      resolve(results);
    });
    connection.end();
  });
  ctx.body = {hoge:results};
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
