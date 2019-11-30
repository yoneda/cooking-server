const Router = require("koa-router");
const router = new Router();

const userRoutes = require("./users-routes");
const recipeRoutes = require("./recipes-routes");

router.use(userRoutes);
router.use(recipeRoutes);

module.exports = router.routes();
