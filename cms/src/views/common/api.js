export default (request, error) => {
  return {
    getOrderById(_id) {
      if (!_id) error('_id必填');
      return request.get('/order/info/' + _id);
    },
    check(params) {
      return request.post('/order/info/', params);
    }
  };
}
