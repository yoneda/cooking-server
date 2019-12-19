const auth = (ctx, next) => {
  ctx.assert(ctx.state.user, "authentication required!");
  return next();
};

module.exports = { auth };
