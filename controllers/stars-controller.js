const db = require("../db");

const putOneStar = async ctx => {
  const { id } = ctx.params;
  const { account } = ctx.query;

  const [{ id: userId }] = await db("users")
    .select("id")
    .where({ account });

  const [starId] = await db("stars").insert({ user: userId, recipe: id });
  ctx.body = { success: true };
};

const delOneStar = async ctx => {
  const { id } = ctx.params;
  const { account } = ctx.query;

  const [{ id: userId }] = await db("users")
    .select("id")
    .where({ account });

  const num = await db("stars")
    .where({ user: userId, recipe: id })
    .del();
  ctx.body = { success: true };
};

module.exports = {
  putOne: putOneStar,
  delOne: delOneStar,
};
