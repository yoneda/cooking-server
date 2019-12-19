const auth = (ctx, next) => {
  console.log(ctx.state);
  ctx.assert(ctx.state.user, "authentication required!");
  return next();
};

module.exports = { auth };
