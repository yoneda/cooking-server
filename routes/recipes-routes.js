const controller = require("../controllers");
const { auth } = require("../middlewares/auth-middleware");
const Router = require("koa-router");
const router = new Router();

router.get("/recipes", controller.recipes.get);
router.get("/recipes/:id", controller.recipes.getOne);
router.post("/recipes", auth, controller.recipes.post);
router.put("/recipes/:id", auth, controller.recipes.put);
router.del("/recipes/:id", auth, controller.recipes.del);

router.put("/recipes/:id/star", auth, controller.stars.putOne);
router.del("/recipes/:id/star", auth, controller.stars.delOne);

module.exports = router.routes();
