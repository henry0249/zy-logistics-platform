export default (request, error) => {
  return {
    //company
    getCompany(data) {
      return request.post('/comapny/find/', data);
    },
    getCompanyFindOne(data) {
      return request.post('/company/findOne/', data);
    },
    //area
    addArea(data) {
      return request.post('/area/add', data);
    },
    getArea(data) {
      return request.post('/area/find', data);
    },
    //role
    deleteRole(data) {
      return request.post('/role/delete', data);
    },
    getRole(data) {
      return request.post('/role/find', data);
    },
    addRole(data) {
      return request.post('/role/add', data);
    },
    //ship
    addShip(data) {
      return request.post('/ship/add', data);
    },
    //truck
    addTruck(data) {
      return request.post('/truck/add', data);
    },
    // price
    addPrice(data) {
      return request.post('/price/add', data);
    },
    getPrice(data) {
      return request.post('/price/find', data);
    },
    getPriceFindOne(data) {
      return request.post('/price/findOne', data);
    },
    //user
    updateUser(data) {
      return request.post('/user/update', data);
    },
    getUSerFindOne(data) {
      return request.post('/user/findOne', data);
    },
    // goods
    getGoodsFindOne(data) {
      return request.post('/goods/findOne', data);
    },
    addGoods(data) {
      return request.post('/goods/add', data);
    },
    updateGoods(data) {
      return request.post('/goods/update', data);
    },
    // brand
    getBrand(data) {
      return request.post('/brand/find', data);
    },
    getBrandFindOne(data) {
      return request.post('/brand/findOne', data);
    },
    addBrand(data) {
      return request.post('/brand/add', data);
    },
    updateBrand(data) {
      return request.post('/brand/update', data);
    },
    // category
    getCategory(data) {
      return request.post('/category/find', data);
    },
    getCategoryFindOne(data) {
      return request.post('/category/findOne', data);
    },
    updateCategory(data) {
      return request.post('/category/update', data);
    },
    addCategory(data) {
      return request.post('/category/add', data);
    },
  };
}
