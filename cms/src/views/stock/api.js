export default (request, error) => {
  return {
    //stock
    stockMulti(data) {
      return request.post('/stock/multi',data);
    },
    updateStock(data) {
      return request.post('/stock/update', data);
    },
    addStock(data) {
      return request.post('/stock/add', data);
    },
    getStockFindOne(data){
      return request.post('/stock/findOne', data);
    },
    getStock(data){
      return request.post('/stock/find', data);
    },
    stockSimpleStatistics(){
      return request.post('/stock/simpleStatistics', data);
    },
    stockChart(data){
      return request.post('/stock/chart', data);
    },
    deleteStock(data){
      return request.post('/stock/delete', data);
    },
    //logisticsTrajectory
    getLogisticsTrajectory(data){
      return request.post('/logisticsTrajectory/find', data);
    },
    //goods
    getGoods(data){
      return request.post('/goods/find', data);
    },
    getGoodsCount(data){
      return request.post('/goods/count', data);
    },
    // map
    mapGeocoder(data){
      return request.post('/map/geocoder', data);
    },
  };
}
