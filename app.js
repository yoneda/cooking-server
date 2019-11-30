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
// レシピ

/*
router.put("/recipes/:id/star", async (ctx, next) => {
  const { id } = ctx.params;
  const { account } = ctx.query;

  const [{ id: userId }] = await knex("users")
    .select("id")
    .where({ account });

  const [starId] = await knex("stars").insert({ user: userId, recipe: id });
  ctx.body = { success: true };
});

router.delete("/recipes/:id/star", async (ctx, next) => {
  const { id } = ctx.params;
  const { account } = ctx.query;

  const [{ id: userId }] = await knex("users")
    .select("id")
    .where({ account });

  const num = await knex("stars")
    .where({ user: userId, recipe: id })
    .del();
  ctx.body = { success: true };
});

// ユーザ
router.get("/users", async (ctx, next) => {
  const users = await knex.select().from("users");
  ctx.body = { users: users };
});

router.get("/users/:account", async (ctx, next) => {
  const { account } = ctx.params;
  const [user] = await knex
    .select()
    .from("users")
    .where({ account })
    .limit(1);
  ctx.body = { user: user };
});

router.post("/users", async (ctx, next) => {
  const { account, mail, pass } = ctx.query;
  const [id] = await knex.into("users").insert({ account, mail, pass });
  const [user] = await knex
    .select()
    .from("users")
    .where({ id });
  ctx.body = { user: user };
  // TODO: 返却するHttpResponceのstatusを201にする(現状は200)
});

router.put("/users", async (ctx, next) => {
  const query = cloneDeep(ctx.query);
  const { account } = query;
  const clearQuery = pickBy(
    query,
    (value, key) => key !== "account" && value !== undefined
  );

  const id = await knex("users")
    .where({ account })
    .update(clearQuery);

  const [user] = await knex
    .select()
    .from("users")
    .where({ id: 1 })
    .limit(1);

  ctx.body = { user };
  // TODO: 返却するHttpResponceのstatusを201にする(現状は200)
  // TODO: HTTPメソッドのPUTは、リソースの更新、なければ作成と定義されている
  // PUTの定義に厳密に従うのならば、リソースがなければ作成、という部分を実装する必要があるが今回は一旦省いている。
});

router.del("/users", async (ctx, next) => {
  const { account } = ctx.query;
  const num = await knex("users")
    .where({ account })
    .del();
  ctx.body = { success: num > 0 };
});

*/

const routes = require("./routes");

console.log(routes);

app.use(routes).use(router.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
