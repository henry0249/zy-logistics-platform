module.exports = () => {
  return async function jwtVerify(ctx, next) {
    let tokenData = await ctx.service.jwt.verify();
    ctx.user = tokenData.user;
    ctx.company = tokenData.company;
    ctx.platform = tokenData.platform;
    ctx.tokenData = tokenData;
    await next();
  };
};