const db = require("../db");
const jwt = require("jsonwebtoken");
const { pick, omit, isEmpty } = require("lodash");

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

  const secret = process.env.SECRET;
  const token = jwt.sign(
    { user: pick(user, ["account", "mail", "password"]) },
    secret,
    {
      expiresIn: "2m"
    }
  );
  ctx.body = { user: { ...omit(user, ["password"]), token } };
};

module.exports = {
  loginUser: loginUser
};
