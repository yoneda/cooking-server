const { pickBy, omit, isEmpty } = require("lodash");
const genToken = require("../utils/genToken");
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

// TODO: HttpResponce を201にする
const postUsers = async ctx => {
  const { account, password } = ctx.query;
  // 既に同じアカウントのユーザが登録されていないか
  const res = await db("users")
    .select("id")
    .where({ account })
    .limit(1);
  if (res.length > 0) {
    ctx.throw(400, "duplicate account or mail");
  }
  const [id] = await db.into("users").insert({ account, password });
  const [user] = await db
    .select()
    .from("users")
    .where({ id });
  
    const token = genToken(account, password);
    ctx.body = { user: { ...omit(user, ["password"]), token } };
};

// TODO: HttpResponce を201にする
// TODO: HttpメソッドのPUTは、リソースを更新してなければ作成、と定義されているがそうなってはいない
const putUser = async ctx => {
  const { account } = ctx.params;
  const clearQuery = pickBy(ctx.query, value => value !== undefined);
  
  await db("users")
    .where({ account })
    .update(clearQuery);

  const [user] = await db
    .select()
    .from("users")
    .where({ account })
    .limit(1);

  ctx.body = { user };
};

const delUser = async ctx => {
  const { account } = ctx.params;
  const num = await db("users")
    .where({ account })
    .del();
  ctx.body = { success: num > 0 };
};

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
  get: getUsers,
  getOne: getOneUser,
  post: postUsers,
  put: putUser,
  del: delUser,
  login: loginUser,
};
