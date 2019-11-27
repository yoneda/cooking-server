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

const dayjs = require("dayjs");
const { pickBy, cloneDeep } = require("lodash");

// corsを許可
app.use(cors());

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

// TODO: 必須のリクエストパラメータがあるか考える
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

router.post("/recipes", async (ctx, next) => {
  const { title, ingredients, directions, cookTime, cost } = ctx.query;
  const recipesId = await knex
    .into("recipes")
    .insert({
      title,
      updatedAt: dayjs().format("YYYY-M-D H:mm:ss"),
      createdAt: dayjs().format("YYYY-M-D H:mm:ss"),
      cookTime: parseInt(cookTime, 10),
      cost: parseInt(cost, 10)
    })
    .then(id => id[0]);
  const directionsId = await knex
    .into("directions")
    .insert(
      directions.split(",").map((direction, index) => ({
        text: direction,
        recipe: recipesId,
        process: index
      }))
    )
    .then(id => id[0]);
  const ingredientIds = await Promise.all(
    ingredients.split(",").map(ingredient =>
      knex
        .into("ingredients")
        .insert({
          name: ingredient
        })
        .then(id => id[0])
    )
  );

  await knex.into("recipes_ingredients").insert(
    ingredientIds.map(id => ({
      recipe: recipesId,
      ingredient: id
    }))
  );

  console.log("done!");
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
  ctx.body = {success: num > 0 };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
