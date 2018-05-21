const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
module.exports = function (name) {
  if (name != 'ALL') {
    const typeObj = {
      'Object': Object,
      'Number': Number,
      'String': String,
      'Array': Array,
      'Date': Date,
      'Boolean': Boolean,
      'ObjectId': mongoose.Schema.Types.ObjectId
    };
    let obj = {};
    let field = JSON.parse(JSON.stringify(require('./' + name)));
    for (const key in field) {
      let item = field[key];
      if (item.type === 'ObjectIdArray') {
        item.type = typeObj['ObjectId'];
        let temp = [];
        temp.push(item);
        obj[key] = temp;
      } else {
        item.type = typeObj[item.type];
        obj[key] = item;
      }
    }
    obj.desc = {
      type: String,
      name: '描述'
    };
    obj.remark = {
      type: String,
      name: '备注'
    };
    let schema = new mongoose.Schema(obj, {
      versionKey: false,
      timestamps: true,
      collection: name
    });
    return {
      name,
      schema,
      obj
    };
  } else {
    let res = {}
    fs.readdirSync(__dirname).forEach((file) => {
      var pathname = path.join(__dirname, file);
      if (file !== 'index.js') {
        let dataItem = require('./' + file);
        res[file.replace('.js', '')] = dataItem;
      }
    });
    return res;
  }
}