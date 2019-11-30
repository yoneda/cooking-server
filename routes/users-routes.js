const controller = require("../controllers");
const Router = require("koa-router");
const router = new Router();

router.get("/users", controller.users.get);
router.get("/users/:account", controller.users.getOne);

module.exports = router.routes();