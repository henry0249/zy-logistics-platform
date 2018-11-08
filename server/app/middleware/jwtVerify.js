module.exports = () => {
  return async function jwtVerify(ctx, next) {
    let tokenData = await ctx.service.jwt.verify();
    ctx.user = tokenData.user;
    ctx.company = tokenData.company;
    ctx.platform = tokenData.platform;
    ctx.tokenData = tokenData;
    await authentication(ctx, tokenData.user._id);
    await next();
  };
};

let roleConfig = require('./role');

async function authentication(ctx, user_id) {
  let path = ctx.request.path;
  if (roleConfig[path]) {
    let hasPower = await ctx.model.Role.findOne({
      type: {
        $in: roleConfig[path]
      },
      user: user_id
    });
    if (!hasPower) {
      ctx.throw(400, '您的权限不足');
    }
  }
}