const db = require("../db");

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

module.exports = {
  get: getRecipes,
  getOne: getOneRecipe,
};
