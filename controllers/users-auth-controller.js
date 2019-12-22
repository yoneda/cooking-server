const db = require("../db");
const { omit, isEmpty } = require("lodash");
const genToken = require("../utils/genToken");


const loginUser = async ctx => {
  const { account, password } = ctx.query;
  const [user] = await db
    .select()
    .from("users")
    .where({ account, password })
    .limit(1);

  if (isEmpty(user)) {
    ctx.throw(401,"invalid username or password");
  }

  const token = genToken(account, password);
  ctx.body = { user: { ...omit(user, ["password"]), token } };
};

module.exports = {
  loginUser: loginUser
};
