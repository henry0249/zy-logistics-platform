module.exports = () => {
  return async function jwtVerify(ctx, next) {
    ctx.user = await ctx.service.jwt.verify();
    await next();
  };
};