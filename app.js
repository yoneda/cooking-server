"use strict";
const koa = require("koa");
const koaRouter = require("koa-router");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const cors = require("@koa/cors");

const app = new koa();
const router = new koaRouter();

const knexConfig = {
  client: "mysql",
  connection: {
    host: "m7nj9dclezfq7ax1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "a6p9p4y8675jagbb",
    password: "vh2sf4kiobbbdmy7",
    database: "do6sfdqn1wbkjayj"
  }
};
const knex = require("knex")(knexConfig);

// corsを許可
app.use(cors());

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

// レシピ
router.get("/recipes", async (ctx, next) => {
  const recipes = await knex
    .select()
    .from("recipes")
    .orderBy("createdAt", "desc");
  ctx.body = { recipes: recipes };
});

router.get("/recipes/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const recipe = await knex
    .select()
    .from("recipes")
    .where("id", id)
    .limit(1);
  ctx.body = { recipe: recipe };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
