const controller = require("../controllers");
const { auth } = require("../middlewares/auth-middleware");
const Router = require("koa-router");
const router = new Router();

router.post("/users/login", controller.usersAuth.loginUser);

router.get("/users", controller.users.get);
router.get("/users/:account", controller.users.getOne);
router.post("/users", auth, controller.users.post);
router.put("/users/:account", auth, controller.users.put);
router.del("/users/:account", auth, controller.users.del);

router.get("/users/:account/recipes", controller.usersRelated.getRecipes);
router.get("/users/:account/stars", controller.usersRelated.getStaredRecipes);

module.exports = router.routes();