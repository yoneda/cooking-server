const db = require("../db");

const loginUser = async ctx => {
  const { account } = ctx.query;
  const [user] = await db
    .select()
    .from("users")
    .where({ account })
    .limit(1);
  const nextUser = { ...user, token: "tokentokentoken" };
  ctx.body = { user: nextUser };
};

module.exports = {
  loginUser: loginUser
};
