const { pickBy } = require("lodash");
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
  const { account, mail, pass } = ctx.query;
  const [id] = await db.into("users").insert({ account, mail, pass });
  const [user] = await db
    .select()
    .from("users")
    .where({ id });
  ctx.body = { user: user };
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

module.exports = {
  get: getUsers,
  getOne: getOneUser,
  post: postUsers,
  put: putUser,
  del: delUser
};
