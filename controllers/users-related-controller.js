const db = require("../db");

const getUsersRecipes = async ctx => {
  const { account } = ctx.params;
  const recipes = await db("recipes")
    .select("recipes.*", "users.account")
    .join("users", "recipes.user", "users.id")
    .where("users.account", account);
  ctx.body = { recipes };
};

const getUsersStars = async ctx => {
  const { account } = ctx.params;
  const recipes = await db("stars")
    .select("recipes.*", "users.account")
    .join("recipes", "stars.recipe", "recipes.id")
    .join("users", "stars.user", "users.id")
    .where("users.account", account);
  ctx.body = { recipes };
};

module.exports = {
  getRecipes: getUsersRecipes,
  getStaredRecipes : getUsersStars,
};
