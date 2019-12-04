const dayjs = require("dayjs");
const db = require("../db");
const { pick, pickBy, identity } = require("lodash");

// MEMO: group_concatの部分を関数化すると綺麗にかける
// MEMO: 以下のSQL文と同等
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

const getRecipes = async ctx => {
  const ingredientsQuery = db("recipes_ingredients as r_i")
    .select("r_i.id", "r_i.recipe", "i.name")
    .innerJoin("ingredients as i", "r_i.ingredient", "i.id")
    .as("b_r_i");
  const recipes = await db("recipes as r")
    .select(
      "r.*",
      "u.account",
      db.raw("group_concat(d.text separator ',') as directions"),
      db.raw("group_concat(b_r_i.name separator ',') as ingredients")
    )
    .leftJoin("users as u", "r.user", "u.id")
    .leftJoin("directions as d", "r.id", "d.recipe")
    .leftJoin(ingredientsQuery, "r.id", "b_r_i.recipe")
    .groupBy("r.id")
    .orderBy("r.updatedAt", "desc");
  ctx.body = { recipes: recipes };
};

const getOneRecipe = async ctx => {
  const { id } = ctx.params;
  const ingredientsQuery = db("recipes_ingredients as r_i")
    .select("r_i.id", "r_i.recipe", "i.name")
    .innerJoin("ingredients as i", "r_i.ingredient", "i.id")
    .as("b_r_i");
  const recipe = await db("recipes as r")
    .select(
      "r.*",
      "u.account",
      db.raw("group_concat(d.text separator ',') as directions"),
      db.raw("group_concat(b_r_i.name separator ',') as ingredients")
    )
    .leftJoin("users as u", "r.user", "u.id")
    .leftJoin("directions as d", "r.id", "d.recipe")
    .leftJoin(ingredientsQuery, "r.id", "b_r_i.recipe")
    .groupBy("r.id")
    .where("r.id", id);
  ctx.body = { recipe: recipe };
};

const postRecipes = async ctx => {
  const { title, ingredients, directions, cookTime, cost, account } = ctx.query;

  const [user] = await db
    .select()
    .from("users")
    .where({ account })
    .limit(1);

  const [recipeId] = await db("recipes").insert({
    title,
    updatedAt: dayjs().format("YYYY-M-D H:mm:ss"),
    createdAt: dayjs().format("YYYY-M-D H:mm:ss"),
    cookTime: parseInt(cookTime, 10),
    cost: parseInt(cost, 10),
    user: user.id
  });
  const [directionsId] = await db("directions").insert(
    directions.split(",").map((direction, index) => ({
      text: direction,
      recipe: recipeId,
      process: index
    }))
  );

  let ingredientIds = [];
  for (const ingredient of ingredients.split(",")) {
    const existId = await db("ingredients")
      .where({ name: ingredient })
      .limit(1)
      .then(results => (results.length > 0 ? results[0].id : 0));
    if (existId > 0) {
      const [{ reference }] = await db("ingredients")
        .select("reference")
        .where({ name: ingredient })
        .limit(1);
      await db("ingredients")
        .where({ name: ingredient })
        .update({ reference: reference + 1 });
      ingredientIds.push(existId);
    } else {
      const [createdId] = await db("ingredients").insert({
        name: ingredient,
        reference: 1
      });
      ingredientIds.push(createdId);
    }
  }

  await db("recipes_ingredients").insert(
    ingredientIds.map(id => ({
      recipe: recipeId,
      ingredient: id
    }))
  );
  ctx.body = { success: true };
};

const putRecipes = async ctx => {
  // TODO: 編集権限のチェックが必要
  const { id: recipeId } = ctx.params;
  const { ingredients, directions } = ctx.query;

  // recipeテーブルのtitle, cookTime, coconst { ingredients, directions } = ctx.query カラムを更新
  const clearQuery = pickBy(ctx.query, identity);
  const recipeQuery = pick(clearQuery, ["title", "cookTime", "cost"]);
  await db("recipes")
    .update(recipeQuery)
    .where({ id: recipeId });

  // directionsテーブルを更新。全部消して全部いれる
  if (directions) {
    await db("directions")
      .del()
      .where({ recipe: recipeId });
    await db("directions").insert(
      directions.split(",").map((direction, index) => ({
        text: direction,
        recipe: recipeId,
        process: index
      }))
    );
  }

  const existIngredientIds = await db("recipes_ingredients")
    .select("ingredient")
    .where({ recipe: recipeId })
    .then(results => results.map(r => r.ingredient));

  for (const ingredientId of existIngredientIds) {
    const [{ reference }] = await db("ingredients")
      .select("reference")
      .where({ id: ingredientId });
    if (reference > 1) {
      await db("ingredients")
        .update({ reference: reference - 1 })
        .where({ id: ingredientId });
    } else {
      await db("ingredients")
        .del()
        .where({ id: ingredientId });
    }
  }

  let ingredientIds = [];
  for (const ingredient of ingredients.split(",")) {
    const existId = await db("ingredients")
      .where({ name: ingredient })
      .limit(1)
      .then(results => (results.length > 0 ? results[0].id : 0));
    if (existId > 0) {
      const [{ reference }] = await db("ingredients")
        .select("reference")
        .where({ name: ingredient })
        .limit(1);
      await db("ingredients")
        .where({ name: ingredient })
        .update({ reference: reference + 1 });
      ingredientIds.push(existId);
    } else {
      const [createdId] = await db("ingredients").insert({
        name: ingredient,
        reference: 1
      });
      ingredientIds.push(createdId);
    }
  }
  // recipes-seed.js と同じコードを再度かいているのでリファクタリングが必要

  await db("recipes_ingredients")
    .del()
    .where({ recipe: recipeId });

  await db("recipes_ingredients").insert(
    ingredientIds.map(id => ({
      recipe: recipeId,
      ingredient: id
    }))
  );
};

const delRecipes = async ctx => {
  const { id } = ctx.params;
  const ingredientIds = (
    await db("recipes_ingredients")
      .select("ingredient")
      .where({ recipe: id })
  ).map(row => row.ingredient);

  await db("recipes")
    .del()
    .where({ id });
  await db("directions")
    .del()
    .where({ recipe: id });
  await db("recipes_ingredients")
    .del()
    .where({ recipe: id });
  for (const ingredientId of ingredientIds) {
    const [{ reference }] = await db("ingredients").where({ id: ingredientId });
    if (reference == 1) {
      await db("ingredients")
        .del()
        .where({ id: ingredientId });
    } else {
      await db("ingredients")
        .where({ id: ingredientId })
        .update({ reference: reference - 1 });
    }
  }
  ctx.body = { success: true };
};

module.exports = {
  get: getRecipes,
  getOne: getOneRecipe,
  post: postRecipes,
  put: putRecipes,
  del: delRecipes
};
