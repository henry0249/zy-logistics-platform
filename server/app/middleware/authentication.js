let roleConfig = {
  invoiceCleck:['/bus']
}

module.exports = () => {
  return async function authentication(ctx, next) {
    console.log(ctx.request.path);
    await next();
  };
};