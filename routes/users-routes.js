const controller = require("../controllers");
const Router = require("koa-router");
const router = new Router();

router.get("/users", controller.users.get);
router.get("/users/:account", controller.users.getOne);
router.post("/users", controller.users.post);
router.put("/users/:account", controller.users.put);
router.del("/users/:account", controller.users.del);

router.get("/users/:account/recipes", controller.usersRelated.getRecipes);
router.get("/users/:account/stars", controller.usersRelated.getStaredRecipes);


module.exports = router.routes();