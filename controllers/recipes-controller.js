const db = require("../db");

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

module.exports = {
  get: getRecipes,
  getOne: getOneRecipe,
};
