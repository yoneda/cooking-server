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
  // ALERT: 以下のSQL文と同等
  /*
    SELECT r.*, u.account, GROUP_CONCAT(d.text SEPARATOR ",") AS directions, GROUP_CONCAT(b_r_i.name SEPARATOR ",") AS ingredients
    FROM recipes AS r
    LEFT JOIN users AS u ON r.user = u.id
    LEFT JOIN directions AS d ON r.id = d.recipe
    LEFT JOIN
    (
    SELECT r_i.id, r_i.recipe, i.name FROM recipes_ingredients AS r_i
    INNER JOIN ingredients as i on r_i.ingredient = i.id
    )
    AS b_r_i
    ON r.id = b_r_i.recipe
    GROUP BY r.id;
  */
  // group_concatの部分をもっと綺麗に書きたかったら、knexに寄せてgropConcat文を生成できる関数をutilsとして追加する
  // knexの限界を感じている…
  const ingredientsQuery = knex("recipes_ingredients as r_i")
    .select("r_i.id", "r_i.recipe", "i.name")
    .innerJoin("ingredients as i", "r_i.ingredient", "i.id")
    .as("b_r_i");
  const recipes = await knex("recipes as r")
    .select(
      "r.*",
      "u.account",
      knex.raw("group_concat(d.text separator ',') as directions"),
      knex.raw("group_concat(b_r_i.name separator ',') as ingredients")
    )
    .leftJoin("users as u", "r.user", "u.id")
    .leftJoin("directions as d", "r.id", "d.recipe")
    .leftJoin(ingredientsQuery, "r.id", "b_r_i.recipe")
    .groupBy("r.id")
    .orderBy("r.updatedAt", "desc");
  ctx.body = { recipes: recipes };
});

router.get("/recipes/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const ingredientsQuery = knex("recipes_ingredients as r_i")
    .select("r_i.id", "r_i.recipe", "i.name")
    .innerJoin("ingredients as i", "r_i.ingredient", "i.id")
    .as("b_r_i");
  const recipe = await knex("recipes as r")
    .select(
      "r.*",
      "u.account",
      knex.raw("group_concat(d.text separator ',') as directions"),
      knex.raw("group_concat(b_r_i.name separator ',') as ingredients")
    )
    .leftJoin("users as u", "r.user", "u.id")
    .leftJoin("directions as d", "r.id", "d.recipe")
    .leftJoin(ingredientsQuery, "r.id", "b_r_i.recipe")
    .groupBy("r.id")
    .where("r.id", id);
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

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT));
