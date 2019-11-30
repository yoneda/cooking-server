const controller = require("../controllers");
const Router = require("koa-router");
const router = new Router();

router.get("/recipes", controller.recipes.get);
router.get("/recipes/:id", controller.recipes.getOne);
router.post("/recipes", controller.recipes.post);

module.exports = router.routes();