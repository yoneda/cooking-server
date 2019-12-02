const fake = require("../fake");
const { pick } = require("lodash");

// MEMO: async関数はPromiseを返す
const insertOne = async (recipe, db) => {
  const [recipeId] = await db("recipes").insert(
    pick(recipe, [
      "id",
      "title",
      "updatedAt",
      "createdAt",
      "cookTime",
      "cost",
      "user"
    ])
  );

  await db("directions").insert(
    recipe.directions.map((direction, index) => ({
      text: direction,
      recipe: recipeId,
      process: index
    }))
  );

  let ingredientIds = [];
  // ALRET: 処理が逐次になるよう、Promise.all(array.map())ではなくてfor(ele in array){await ele}を使う
  for (const ingredient of recipe.ingredients) {
    // 同名のものがすでにあるか
    const existId = await db("ingredients")
      .where({ name: ingredient })
      .limit(1)
      .then(results => (results.length > 0 ? results[0].id : 0));
    if (existId > 0) ingredientIds.push(existId);
    else {
      const [createdId] = await db("ingredients").insert({
        name: ingredient
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
};

exports.seed = async knex => {
  await knex("recipes").del();
  await knex("directions").del();
  await knex("ingredients").del();
  await knex("recipes_ingredients").del();
  for (const recipe of fake.recipes) {
    await insertOne(recipe, knex);
  }
};

// MEMO: jsonのデータを複数テーブル(3つ)に挿入するのは難しすぎる。
// 一旦、すでに完成済みのデータを挿入することにする(recipes, ingredients, recipes_ingredientsのそれぞれ)
// for - await でいけるか!?
