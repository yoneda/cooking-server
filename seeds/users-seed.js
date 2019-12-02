const fake = require("../fake");

exports.seed = knex =>
  knex("users")
    .del()
    .then(() => knex("users").insert(fake.users));
