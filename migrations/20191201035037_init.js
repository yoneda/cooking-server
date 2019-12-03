exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments("id");
      table.string("account");
      table.string("name");
      table.string("bio");
      table.string("mail");
      table.string("password");
    })
    .createTable("recipes", table => {
      table.increments("id");
      table.string("title");
      table.datetime("createdAt");
      table.datetime("updatedAt");
      table.integer("cookTime");
      table.integer("cost");
      table.integer("user");
    })
    .createTable("directions", table => {
      table.increments("id");
      table.string("text");
      table.integer("recipe");
      table.integer("process");
    })
    .createTable("ingredients", table => {
      table.increments("id");
      table.string("name");
      table.integer("reference");
    })
    .createTable("recipes_ingredients", table => {
      table.increments("id");
      table.integer("recipe");
      table.integer("ingredient");
    })
    .createTable("stars", table => {
      table.increments("id");
      table.integer("user");
      table.integer("recipe");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("recipes")
    .dropTable("directions")
    .dropTable("ingredients")
    .dropTable("recipes_ingredients")
    .dropTable("stars");
};
