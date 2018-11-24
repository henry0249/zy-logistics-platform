export default (request, error) => {
  return {
    //company
    updateCompany(data) {
      return request.post('/company/update', data);
    },
    getCompanyFindOne(data) {
      return request.post('/company/findOne', data);
    },
    getCompany(data) {
      return request.post('/company/find', data);
    },
    //relationCode
    getRelationCode(data) {
      return request.post('/relationCode/find', data);
    },
    deleteRelationCode(data) {
      return request.post('/relationCode/delete', data);
    },
    addRelationCode(data) {
      return request.post('/relationCode/add', data);
    },
    updateRelationCode(data) {
      return request.post('/relationCode/update', data);
    },
    //accountChange
    updateAccountChange(data) {
      return request.post('/accountChange/update', data);
    },
    accountChangeCheckFail(data) {
      return request.post('/accountChange/checkFail', data);
    },
    accountChangeCheck(data) {
      return request.post('/accountChange/check', data);
    },
    deleteAccountChange(data) {
      return request.post('/accountChange/delete', data);
    },
    addAccountChange(data) {
      return request.post('/accountChange/add', data);
    },
    getAccountChangeFIndOne(data) {
      return request.post('/accountChange/findOne', data);
    },
    //invoice
    getInvoiceFIndOne(data) {
      return request.post('/invoice/findOne', data);
    },
    invoiceCheckFail(data) {
      return request.post('/invoice/checkFail', data);
    },
    invoiceCheck(data) {
      return request.post('/invoice/check', data);
    },
    deleteInvoice(data) {
      return request.post('/invoice/delete', data);
    },
    updateInvoice(data) {
      return request.post('/invoice/update', data);
    },
    addInvoice(data) {
      return request.post('/invoice/add', data);
    },
    //user
    getUserFindOne(data) {
      return request.post('/user/findOne', data);
    },
    //company
    getCompanyFindOne(data) {
      return request.post('/company/findOne', data);
    },
    //tab and list
    getAccountRelationTab(data) {
      return request.post('/account/relation/tab', data);
    },
    getAccountRelationList(data) {
      return request.post('/account/relation/list', data);
    },
    //role
    getRole(data) {
      return request.post('/role/find', data);
    },
    deleteRole(data) {
      return request.post('/role/delete', data);
    },
    roleMulti(data) {
      return request.post('/role/multi', data);
    },
    //ship
    updateShip(data) {
      return request.post('/ship/update', data);
    },
    deleteShip(data) {
      return request.post('/ship/delete', data);
    },
    addShip(data) {
      return request.post('/ship/add', data);
    },
    getShip(data) {
      return request.post('/ship/find', data);
    },
    //truck
    updateTruck(data) {
      return request.post('/truck/update', data);
    },
    deleteTruck(data) {
      return request.post('/truck/delete', data);
    },
    addTruck(data) {
      return request.post('/truck/add', data);
    },
    getTruck(data) {
      return request.post('/truck/find', data);
    }
  };
}
