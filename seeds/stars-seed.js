const fake = require("../fake");

exports.seed = knex =>
  knex("stars")
    .del()
    .then(() => knex("stars").insert(fake.stars));
