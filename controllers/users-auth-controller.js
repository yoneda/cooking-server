const db = require("../db");
const jwt = require("jsonwebtoken");
const { pick } = require("lodash");

const loginUser = async ctx => {
  const { account } = ctx.query;
  const [user] = await db
    .select()
    .from("users")
    .where({ account })
    .limit(1);

  const secret = process.env.SECRET;
  const token = jwt.sign(
    { user: pick(user, ["account", "mail", "password"]) },
    secret,
    {
      expiresIn: "60000"
    }
  );
  ctx.body = { user: { ...user, token } };
};

module.exports = {
  loginUser: loginUser
};
