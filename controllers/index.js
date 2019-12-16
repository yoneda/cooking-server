const recipes = require("./recipes-controller");
const stars = require("./stars-controller");
const users = require("./users-controller");
const usersRelated = require("./users-related-controller");
const usersAuth = require("./users-auth-controller");

module.exports = {
  recipes,
  stars,
  users,
  usersRelated,
  usersAuth
};
