"use strict";
const koa = require("koa");
const koaJwt = require("koa-jwt");
const koaRouter = require("koa-router");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const cors = require("@koa/cors");
const routes = require("./routes");
const env = require("dotenv");
const app = new koa();
const router = new koaRouter();

// .envファイルを使用
env.config();

// corsを許可
app.use(cors());

// httpヘッダのauthorization にトークンがあった場合、ctx.state.user に値を追加
// 形式はauthorization: Bearer <Token> で書くこと
const secret = process.env.SECRET;
app.use(
  koaJwt({
    secret,
    passthrough: true
  })
);

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

// TODO: 必須のリクエストパラメータがあるか考える

app.use(routes).use(router.allowedMethods());
app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
