'use strict';
const koa = require('koa');
const koaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const cors = require('@koa/cors');

const app = new koa();
const router = new koaRouter();

const delayObtainTasks = require('./utils/delayObtainTasks.js');
const delayUpdateTask = require('./utils/delayUpdateTask.js');
const delayAddTask = require('./utils/delayAddTask.js');
const delayRemoveTask = require('./utils/delayRemoveTask.js');

// corsを許可
app.use(cors());

// jsonを返す場合 pretty-print
app.use(json());

// postのパラメータをctx.request.body に挿入する
app.use(bodyParser());

// すべてのタスクを取得
router.get("/tasks",async(ctx,next)=>{
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを完了状態にする
router.post("/tasks",async(ctx,next)=>{
  const id = ctx.request.body.id;
  const done = ctx.request.body.done;
  const status = await delayUpdateTask(id,done);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを追加する
router.post("/tasks/add",async(ctx,next)=>{
  const name = ctx.request.body.name;
  const status = await delayAddTask(name);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

// あるタスクを削除する
router.post("/tasks/remove",async(ctx,next)=>{
  const id = ctx.request.body.id;
  const status = await delayRemoveTask(id);
  const tasks = await delayObtainTasks();
  ctx.body = {tasks:tasks};
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000, ()=>console.log(process.env.PORT));