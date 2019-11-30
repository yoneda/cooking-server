const db = require("../db");

const getUsers = async ctx => {
  const users = await db.select().from("users");
  ctx.body = { users };
};

const getOneUser = async ctx => {
  const { account } = ctx.params;
  const [user] = await db
    .select()
    .from("users")
    .where({ account })
    .limit(1);
  ctx.body = { user };
};

module.exports = {
  get: getUsers,
  getOne: getOneUser,
};