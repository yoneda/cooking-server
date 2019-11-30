const controller = require("../controllers");
const Router = require("koa-router");
const router = new Router();

router.get("/recipes", controller.recipes.get);
router.get("/recipes/:id", controller.recipes.getOne);
router.post("/recipes", controller.recipes.post);
router.put("/recipes/:id", controller.recipes.put);
router.del("/recipes/:id", controller.recipes.del);

router.put("/recipes/:id/star", controller.stars.putOne);
router.del("/recipes/:id/star", controller.stars.delOne);

module.exports = router.routes();