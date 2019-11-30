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

// TODO: 必須のリクエストパラメータがあるか考える

const routes = require("./routes");

console.log(routes);

app.use(routes).use(router.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
